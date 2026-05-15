import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";

import {
  CATEGORY_LABELS,
  PROJECT_CATEGORIES,
  CREATOR_PROFILE_DEFAULTS,
  type CreatorProfile,
  type PortfolioProject,
  type PortfolioProjectPreview,
  type ProjectCategory,
} from "@/lib/portfolio-shared";
import { loadMetaOverride } from "@/lib/metadata";

export { CATEGORY_LABELS, PROJECT_CATEGORIES, CREATOR_PROFILE_DEFAULTS as CREATOR_PROFILE };
export type { CreatorProfile, PortfolioProject, PortfolioProjectPreview, ProjectCategory };

export const getCreatorProfile = cache(async (): Promise<CreatorProfile> => {
  try {
    const profilePath = path.join(process.cwd(), "data", "profile.json");
    const raw = await fs.readFile(profilePath, "utf-8");
    const json = JSON.parse(raw) as Partial<CreatorProfile>;
    return { ...CREATOR_PROFILE_DEFAULTS, ...json };
  } catch {
    return CREATOR_PROFILE_DEFAULTS;
  }
});

const ASSET_ROOT = path.join(process.cwd(), "3D-ASSET");

function toModelUrl(relativePath: string): string {
  return (
    "/models/" +
    relativePath
      .split(path.sep)
      .map((s) => encodeURIComponent(s))
      .join("/")
  );
}

function toAssetUrl(relativeDir: string, filename: string): string {
  const dirSegments =
    relativeDir === "."
      ? []
      : relativeDir.split(path.sep).map((s) => encodeURIComponent(s));
  return "/assets/" + [...dirSegments, encodeURIComponent(filename)].join("/");
}

function sanitizeName(fileName: string): string {
  return fileName
    .replace(/\.glb$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function titleCase(input: string): string {
  return input
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function inferCategory(relativePath: string): ProjectCategory {
  const n = relativePath.toLowerCase();
  if (n.startsWith(`animal${path.sep}sea`)) return "character";
  if (n.startsWith(`building${path.sep}`)) return "environment";
  if (n.startsWith(`equipment${path.sep}`) || n.startsWith(`item${path.sep}`)) return "props";
  if (n.includes("vehicle") || n.includes("car") || n.includes("ship")) return "vehicle";
  return "other";
}

function inferSoftware(category: ProjectCategory): string[] {
  const base = ["Blender", "Substance Painter"];
  if (category === "character") return [...base, "ZBrush"];
  if (category === "environment") return [...base, "Unreal Engine"];
  return [...base, "Marmoset Toolbag"];
}

function inferPipeline(category: ProjectCategory): string {
  if (category === "character")
    return "Sculpt -> retopo -> bake normal map -> PBR texturing -> realtime preview";
  if (category === "environment")
    return "Modular blockout -> detail pass -> material pass -> lighting polish";
  return "Modeling -> UV unwrap -> texture bake -> material setup -> final render";
}

function inferDescriptions(title: string, category: ProjectCategory) {
  const label = CATEGORY_LABELS[category];
  return {
    short: `${label} asset untuk eksplorasi style, material, dan presentasi realtime.`,
    long: `${title} adalah project ${label.toLowerCase()} yang dikembangkan untuk portfolio personal. Fokus utama ada pada readability bentuk, kualitas material PBR, dan kesiapan aset untuk workflow game atau realtime rendering.`,
  };
}

function inferPolycount(sizeMb: number): string {
  return `~${Math.max(8, Math.round(sizeMb * 6))}k triangles (estimated)`;
}

function inferTextureResolution(sizeMb: number): string {
  if (sizeMb >= 40) return "4K PBR set";
  if (sizeMb >= 18) return "2K-4K PBR set";
  return "2K PBR set";
}

// ── Manifest ────────────────────────────────────────────────────────────────
// data/assets-manifest.json is the primary source for Vercel (no 3D-ASSET/).
// Each entry: { path, sizeMb, blobUrl? }
// blobUrl is set after uploading to Vercel Blob; until then models show cards
// but the 3D viewer returns 404 on Vercel.

type ManifestEntry = { path: string; sizeMb: number; blobUrl?: string; previewUrl?: string };

async function readManifest(): Promise<ManifestEntry[] | null> {
  try {
    const raw = await fs.readFile(
      path.join(process.cwd(), "data", "assets-manifest.json"),
      "utf-8",
    );
    const entries = JSON.parse(raw) as ManifestEntry[];
    return Array.isArray(entries) && entries.length > 0 ? entries : null;
  } catch {
    return null;
  }
}

async function collectGlbFiles(dir: string, root: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const nested = await Promise.all(
      entries.map(async (e) => {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) return collectGlbFiles(full, root);
        if (e.isFile() && e.name.toLowerCase().endsWith(".glb"))
          return [path.relative(root, full)];
        return [];
      }),
    );
    return nested.flat();
  } catch {
    return [];
  }
}

// ── Main export ─────────────────────────────────────────────────────────────

export const getAllProjects = cache(async (): Promise<PortfolioProject[]> => {
  const manifest = await readManifest();

  let glbEntries: Array<{ relativePath: string; sizeMb: number; blobUrl?: string; previewUrl?: string }>;

  if (manifest) {
    glbEntries = manifest.map(({ path: p, sizeMb, blobUrl, previewUrl }) => ({
      relativePath: p,
      sizeMb,
      blobUrl,
      previewUrl,
    }));
  } else {
    const paths = await collectGlbFiles(ASSET_ROOT, ASSET_ROOT);
    glbEntries = await Promise.all(
      paths.map(async (relativePath) => {
        try {
          const { size } = await fs.stat(path.join(ASSET_ROOT, relativePath));
          return { relativePath, sizeMb: Number((size / 1048576).toFixed(1)) };
        } catch {
          return { relativePath, sizeMb: 0 };
        }
      }),
    );
  }

  const projects = await Promise.all(
    glbEntries.map(async ({ relativePath, sizeMb, blobUrl, previewUrl }, index) => {
      const absolutePath = path.join(ASSET_ROOT, relativePath);
      const meta = await loadMetaOverride(absolutePath);

      const cleanName = sanitizeName(path.basename(relativePath));
      const title = meta.title ?? titleCase(cleanName);
      const category = meta.category ?? inferCategory(relativePath);
      const { short, long } = inferDescriptions(title, category);
      const slug = `${slugify(title)}-${index + 1}`;
      const relativeDir = path.dirname(relativePath);

      const project: PortfolioProject = {
        id: `project-${index + 1}`,
        slug,
        title,
        category,
        year: meta.year ?? 2026,
        descriptionShort: meta.descriptionShort ?? short,
        descriptionLong: meta.descriptionLong ?? long,
        modelUrl: meta.modelUrl ?? (process.env.NODE_ENV !== "development" ? blobUrl : undefined) ?? toModelUrl(relativePath),
        previewUrl: previewUrl ?? undefined,
        sourcePath: relativePath,
        thumbnailImageUrl: meta.thumbnailImage
          ? toAssetUrl(relativeDir, meta.thumbnailImage)
          : undefined,
        heroImageUrl: meta.heroImage ? toAssetUrl(relativeDir, meta.heroImage) : undefined,
        galleryImageUrls: meta.galleryImages?.map((img) => toAssetUrl(relativeDir, img)),
        blendFileUrl: meta.blendFile ? toAssetUrl(relativeDir, meta.blendFile) : undefined,
        softwareUsed: meta.softwareUsed ?? inferSoftware(category),
        polycount: meta.polycount ?? inferPolycount(sizeMb),
        textureResolution: meta.textureResolution ?? inferTextureResolution(sizeMb),
        pipeline: meta.pipeline ?? inferPipeline(category),
        sizeMb,
        isFeatured: false,
        _featuredPinned: meta.isFeatured,
      } as PortfolioProject & { _featuredPinned?: boolean };

      return project;
    }),
  );

  const sorted = (projects as Array<PortfolioProject & { _featuredPinned?: boolean }>).sort(
    (a, b) => {
      if (a.category !== b.category)
        return PROJECT_CATEGORIES.indexOf(a.category) - PROJECT_CATEGORIES.indexOf(b.category);
      return a.title.localeCompare(b.title);
    },
  );

  const pinnedOn = new Set(sorted.filter((p) => p._featuredPinned === true).map((p) => p.id));
  const pinnedOff = new Set(sorted.filter((p) => p._featuredPinned === false).map((p) => p.id));
  const autoSlots = Math.max(0, 6 - pinnedOn.size);
  const autoFeatured = new Set(
    [...sorted]
      .filter((p) => p._featuredPinned === undefined)
      .sort((a, b) => b.sizeMb - a.sizeMb)
      .slice(0, autoSlots)
      .map((p) => p.id),
  );

  return sorted.map(({ _featuredPinned, ...p }) => ({
    ...p,
    isFeatured: pinnedOff.has(p.id) ? false : pinnedOn.has(p.id) || autoFeatured.has(p.id),
  }));
});

export async function getProjectBySlug(slug: string): Promise<PortfolioProject | undefined> {
  return (await getAllProjects()).find((p) => p.slug === slug);
}

export async function getFeaturedProjects(): Promise<PortfolioProject[]> {
  return (await getAllProjects()).filter((p) => p.isFeatured).slice(0, 6);
}

export function toProjectPreview(project: PortfolioProject): PortfolioProjectPreview {
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    category: project.category,
    year: project.year,
    descriptionShort: project.descriptionShort,
    modelUrl: project.modelUrl,
    thumbnailImageUrl: project.thumbnailImageUrl,
    sizeMb: project.sizeMb,
    isFeatured: project.isFeatured,
  };
}
