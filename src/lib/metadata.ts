import fs from "node:fs/promises";
import path from "node:path";

import { type ProjectCategory, PROJECT_CATEGORIES } from "@/lib/portfolio-shared";

export type MetaOverride = {
  title?: string;
  category?: ProjectCategory;
  year?: number;
  descriptionShort?: string;
  descriptionLong?: string;
  softwareUsed?: string[];
  polycount?: string;
  textureResolution?: string;
  pipeline?: string;
  isFeatured?: boolean;
  thumbnailImage?: string;
  heroImage?: string;
  galleryImages?: string[];
  blendFile?: string;
  modelUrl?: string;
};

async function readJsonSafe(filePath: string): Promise<unknown> {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content);
  } catch {
    return null;
  }
}

function validateMeta(raw: unknown): MetaOverride {
  if (!raw || typeof raw !== "object") return {};
  const obj = raw as Record<string, unknown>;
  const result: MetaOverride = {};

  if (typeof obj.title === "string") result.title = obj.title;
  if (typeof obj.year === "number") result.year = obj.year;
  if (typeof obj.descriptionShort === "string") result.descriptionShort = obj.descriptionShort;
  if (typeof obj.descriptionLong === "string") result.descriptionLong = obj.descriptionLong;
  if (typeof obj.polycount === "string") result.polycount = obj.polycount;
  if (typeof obj.textureResolution === "string") result.textureResolution = obj.textureResolution;
  if (typeof obj.pipeline === "string") result.pipeline = obj.pipeline;
  if (typeof obj.isFeatured === "boolean") result.isFeatured = obj.isFeatured;
  if (typeof obj.thumbnailImage === "string") result.thumbnailImage = obj.thumbnailImage;
  if (typeof obj.modelUrl === "string") result.modelUrl = obj.modelUrl;
  if (typeof obj.heroImage === "string") result.heroImage = obj.heroImage;
  if (typeof obj.blendFile === "string") result.blendFile = obj.blendFile;

  if (
    typeof obj.category === "string" &&
    PROJECT_CATEGORIES.includes(obj.category as ProjectCategory)
  ) {
    result.category = obj.category as ProjectCategory;
  }

  if (Array.isArray(obj.softwareUsed) && obj.softwareUsed.every((s) => typeof s === "string")) {
    result.softwareUsed = obj.softwareUsed as string[];
  }

  if (Array.isArray(obj.galleryImages) && obj.galleryImages.every((s) => typeof s === "string")) {
    result.galleryImages = obj.galleryImages as string[];
  }

  return result;
}

/**
 * Loads metadata override for a .glb file.
 * Checks co-located JSON first, then falls back to public/3D-ASSET/ mirror.
 */
export async function loadMetaOverride(glbAbsolutePath: string): Promise<MetaOverride> {
  const assetRoot = path.resolve(process.cwd(), "3D-ASSET");
  const publicRoot = path.resolve(process.cwd(), "public", "3D-ASSET");
  const dir = path.dirname(glbAbsolutePath);
  const baseName = path.basename(glbAbsolutePath, ".glb");

  const relativeSidecarPath = path.relative(assetRoot, path.join(dir, `${baseName}.json`));
  const publicSidecarPath = path.join(publicRoot, relativeSidecarPath);

  const [folderMeta, fileMeta, publicFileMeta] = await Promise.all([
    readJsonSafe(path.join(dir, "_meta.json")).then(validateMeta),
    readJsonSafe(path.join(dir, `${baseName}.json`)).then(validateMeta),
    readJsonSafe(publicSidecarPath).then(validateMeta),
  ]);

  return { ...folderMeta, ...publicFileMeta, ...fileMeta };
}
