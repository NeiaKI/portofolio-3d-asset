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
  const encodedPath = relativePath
    .split(path.sep)
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `/models/${encodedPath}`;
}

function toAssetUrl(relativeDir: string, filename: string): string {
  const dirSegments = relativeDir === "."
    ? []
    : relativeDir.split(path.sep).map((s) => encodeURIComponent(s));
  return `/assets/${[...dirSegments, encodeURIComponent(filename)].join("/")}`;
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
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
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
  const normalized = relativePath.toLowerCase();

  if (normalized.startsWith(`animal${path.sep}sea`)) {
    return "character";
  }

  if (normalized.startsWith(`building${path.sep}`)) {
    return "environment";
  }

  if (
    normalized.startsWith(`equipment${path.sep}`) ||
    normalized.startsWith(`item${path.sep}`)
  ) {
    return "props";
  }

  if (
    normalized.includes("vehicle") ||
    normalized.includes("car") ||
    normalized.includes("ship")
  ) {
    return "vehicle";
  }

  return "other";
}

function inferSoftware(category: ProjectCategory): string[] {
  const base = ["Blender", "Substance Painter"];

  if (category === "character") {
    return [...base, "ZBrush"];
  }

  if (category === "environment") {
    return [...base, "Unreal Engine"];
  }

  return [...base, "Marmoset Toolbag"];
}

function inferPipeline(category: ProjectCategory): string {
  if (category === "character") {
    return "Sculpt -> retopo -> bake normal map -> PBR texturing -> realtime preview";
  }

  if (category === "environment") {
    return "Modular blockout -> detail pass -> material pass -> lighting polish";
  }

  return "Modeling -> UV unwrap -> texture bake -> material setup -> final render";
}

function inferDescriptions(title: string, category: ProjectCategory): {
  short: string;
  long: string;
} {
  const label = CATEGORY_LABELS[category];
  const short = `${label} asset untuk eksplorasi style, material, dan presentasi realtime.`;
  const long = `${title} adalah project ${label.toLowerCase()} yang dikembangkan untuk portfolio personal. Fokus utama ada pada readability bentuk, kualitas material PBR, dan kesiapan aset untuk workflow game atau realtime rendering.`;

  return { short, long };
}

function inferPolycount(sizeMb: number): string {
  const estimatedTriangles = Math.max(8, Math.round(sizeMb * 6));
  return `~${estimatedTriangles}k triangles (estimated)`;
}

function inferTextureResolution(sizeMb: number): string {
  if (sizeMb >= 40) {
    return "4K PBR set";
  }

  if (sizeMb >= 18) {
    return "2K-4K PBR set";
  }

  return "2K PBR set";
}


type ManifestEntry = {
  path: string;
  sizeMb: number;
  blobUrl?: string;
};

async function readManifest(): Promise<ManifestEntry[] | null> {
  try {
    const manifestPath = path.join(process.cwd(), "data", "assets-manifest.json");
    const raw = await fs.readFile(manifestPath, "utf-8");
    const entries = JSON.parse(raw) as ManifestEntry[];
    return Array.isArray(entries) ? entries : null;
  } catch {
    return null;
  }
}

export const getAllProjects = cache(async (): Promise<PortfolioProject[]> => {
  const manifest = await readManifest();

  let glbEntries: Array<{ relativePath: string; sizeMb: number; blobUrl?: string }>;

  if (manifest && manifest.length > 0) {
    glbEntries = manifest.map((entry) => ({
      relativePath: entry.path,
      sizeMb: entry.sizeMb,
      blobUrl: entry.blobUrl,
    }));
  } else {
    // Local dev fallback: scan filesystem
    const glbRelativePaths = await (async function collectGlbFiles(
      currentDir: string,
      rootDir: string,
    ): Promise<string[]> {
      try {
        const entries = await fs.readdir(currentDir, { withFileTypes: true });
        const nested = await Promise.all(
          entries.map(async (entry) => {
            const fullPath = path.join(currentDir, entry.name);
            if (entry.isDirectory()) return collectGlbFiles(fullPath, rootDir);
            if (entry.isFile() && entry.name.toLowerCase().endsWith(".glb"))
              return [path.relative(rootDir, fullPath)];
            return [];
          }),
        );
        return nested.flat();
      } catch {
        return [];
      }
    })(ASSET_ROOT, ASSET_ROOT);

    glbEntries = await Promise.all(
      glbRelativePaths.map(async (relativePath) => {
        try {
          const stats = await fs.stat(path.join(ASSET_ROOT, relativePath));
          return { relativePath, sizeMb: Number((stats.size / (1024 * 1024)).toFixed(1)) };
        } catch {
          return { relativePath, sizeMb: 0 };
        }
      }),
    );
  }

  const projects = await Promise.all(
    glbEntries.map(async ({ relativePath, sizeMb: fileSizeMb, blobUrl: manifestBlobUrl }, index) => {
      const absolutePath = path.join(ASSET_ROOT, relativePath);
      const meta = await loadMetaOverride(absolutePath);

      const cleanName = sanitizeName(path.basename(relativePath));
      const inferredTitle = titleCase(cleanName);
      const title = meta.title ?? inferredTitle;

      const inferredCategory = inferCategory(relativePath);
      const category = meta.category ?? inferredCategory;

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
        modelUrl: meta.modelUrl ?? manifestBlobUrl ?? toModelUrl(relativePath),
        sourcePath: relativePath,
        thumbnailImageUrl: meta.thumbnailImage
          ? toAssetUrl(relativeDir, meta.thumbnailImage)
          : undefined,
        heroImageUrl: meta.heroImage
          ? toAssetUrl(relativeDir, meta.heroImage)
          : undefined,
        galleryImageUrls: meta.galleryImages?.map((img) =>
          toAssetUrl(relativeDir, img),
        ),
        blendFileUrl: meta.blendFile
          ? toAssetUrl(relativeDir, meta.blendFile)
          : undefined,
        softwareUsed: meta.softwareUsed ?? inferSoftware(category),
        polycount: meta.polycount ?? inferPolycount(fileSizeMb),
        textureResolution: meta.textureResolution ?? inferTextureResolution(fileSizeMb),
        pipeline: meta.pipeline ?? inferPipeline(category),
        sizeMb: fileSizeMb,
        isFeatured: false,
        _featuredPinned: meta.isFeatured,
      } as PortfolioProject & { _featuredPinned?: boolean };

      return project;
    }),
  );

  const sorted = (projects as Array<PortfolioProject & { _featuredPinned?: boolean }>).sort(
    (a, b) => {
      if (a.category !== b.category) {
        return PROJECT_CATEGORIES.indexOf(a.category) - PROJECT_CATEGORIES.indexOf(b.category);
      }
      return a.title.localeCompare(b.title);
    },
  );

  const pinnedFeaturedIds = new Set(
    sorted.filter((p) => p._featuredPinned === true).map((p) => p.id),
  );
  const pinnedNotFeaturedIds = new Set(
    sorted.filter((p) => p._featuredPinned === false).map((p) => p.id),
  );

  const autoSlots = Math.max(0, 6 - pinnedFeaturedIds.size);
  const autoFeaturedIds = new Set(
    [...sorted]
      .filter((p) => p._featuredPinned === undefined)
      .sort((a, b) => b.sizeMb - a.sizeMb)
      .slice(0, autoSlots)
      .map((p) => p.id),
  );

  return sorted.map(({ _featuredPinned, ...project }) => ({
    ...project,
    isFeatured:
      pinnedNotFeaturedIds.has(project.id)
        ? false
        : pinnedFeaturedIds.has(project.id) || autoFeaturedIds.has(project.id),
  }));
});

export async function getProjectBySlug(
  slug: string,
): Promise<PortfolioProject | undefined> {
  const projects = await getAllProjects();
  return projects.find((project) => project.slug === slug);
}

export async function getFeaturedProjects(): Promise<PortfolioProject[]> {
  const projects = await getAllProjects();
  return projects.filter((project) => project.isFeatured).slice(0, 6);
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
