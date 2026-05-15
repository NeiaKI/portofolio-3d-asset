/**
 * Upload all GLB files from 3D-ASSET/ to Vercel Blob.
 * Run once: BLOB_READ_WRITE_TOKEN=xxx node scripts/upload-blobs.mjs
 *
 * Outputs a JSON mapping of relative path → blob URL.
 * Paste the output into 3D-ASSET sidecar .json files as "modelUrl".
 */

import { put } from "@vercel/blob";
import { createReadStream, statSync } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSET_ROOT = path.resolve(__dirname, "..", "3D-ASSET");

async function findGlbFiles(dir, root = dir, results = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    if (entry.name === "3D-ASSET-backup") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await findGlbFiles(full, root, results);
    } else if (entry.name.toLowerCase().endsWith(".glb")) {
      results.push(full);
    }
  }
  return results;
}

async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("Error: BLOB_READ_WRITE_TOKEN env var is required.");
    console.error("Get it from: Vercel Dashboard → Storage → your Blob store → .env.local");
    process.exit(1);
  }

  const glbFiles = await findGlbFiles(ASSET_ROOT);
  console.error(`Found ${glbFiles.length} GLB files to upload...`);

  const results = {};

  for (const filePath of glbFiles) {
    const stat = statSync(filePath);
    const sizeMb = (stat.size / 1024 / 1024).toFixed(1);
    const relativePath = path.relative(ASSET_ROOT, filePath);
    const blobPath = `3d-assets/${relativePath.replace(/\\/g, "/")}`;

    process.stderr.write(`Uploading ${relativePath} (${sizeMb}MB)... `);
    try {
      const { url } = await put(blobPath, createReadStream(filePath), {
        access: "public",
        contentType: "model/gltf-binary",
        addRandomSuffix: false,
      });
      results[relativePath] = url;
      process.stderr.write(`✓\n`);
    } catch (err) {
      process.stderr.write(`✗ ${err.message}\n`);
      results[relativePath] = null;
    }
  }

  // Write updated manifest
  const { readFile, writeFile } = await import("node:fs/promises");
  const manifestPath = new URL("../data/assets-manifest.json", import.meta.url);
  let manifest = [];
  try {
    manifest = JSON.parse(await readFile(manifestPath, "utf-8"));
  } catch {}

  const updatedManifest = manifest.map((entry) => {
    const url = results[entry.path];
    if (url) return { ...entry, blobUrl: url };
    return entry;
  });

  // Add any new entries not already in manifest
  for (const [relPath, url] of Object.entries(results)) {
    if (url && !manifest.find((e) => e.path === relPath)) {
      updatedManifest.push({ path: relPath, sizeMb: 0, blobUrl: url });
    }
  }

  await writeFile(manifestPath, JSON.stringify(updatedManifest, null, 2));
  process.stderr.write(`\n✓ Updated data/assets-manifest.json\n`);
  console.log(JSON.stringify(results, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
