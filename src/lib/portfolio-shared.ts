export const PROJECT_CATEGORIES = [
  "props",
  "environment",
  "character",
  "vehicle",
  "other",
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export type MarketplaceLink = {
  platform: "sketchfab" | "cgtrader" | "artstation" | "other";
  label: string;
  url: string;
};

export type PortfolioProject = {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  year: number;
  descriptionShort: string;
  descriptionLong: string;
  modelUrl: string;
  previewUrl?: string;
  sourcePath: string;
  thumbnailImageUrl?: string;
  heroImageUrl?: string;
  galleryImageUrls?: string[];
  blendFileUrl?: string;
  softwareUsed: string[];
  polycount: string;
  textureResolution: string;
  pipeline: string;
  sizeMb: number;
  isFeatured: boolean;
  marketplaceLinks?: MarketplaceLink[];
};

export type PortfolioProjectPreview = Pick<
  PortfolioProject,
  | "id"
  | "slug"
  | "title"
  | "category"
  | "year"
  | "descriptionShort"
  | "modelUrl"
  | "previewUrl"
  | "thumbnailImageUrl"
  | "sizeMb"
  | "isFeatured"
>;

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  props: "Props",
  environment: "Environment",
  character: "Character",
  vehicle: "Vehicle",
  other: "Other",
};

export type SocialLink = { label: string; url: string };

export type CreatorProfile = {
  name: string;
  roleTitle: string;
  bioShort: string;
  bioLong: string;
  location: string;
  email: string;
  skills: string[];
  softwareList: string[];
  socialLinks: SocialLink[];
};

export const CREATOR_PROFILE_DEFAULTS: CreatorProfile = {
  name: "HILMI",
  roleTitle: "3D Environment & Creature Artist",
  bioShort: "Membangun aset 3D stylized-realistic untuk game, cinematic, dan visual storytelling.",
  bioLong:
    "Fokus pada pipeline production-ready dari blockout hingga final polish. Portfolio ini menampilkan eksplorasi creature, environment, serta props dengan pendekatan optimasi untuk realtime.",
  location: "Jakarta, GMT+7",
  email: "",
  skills: [
    "Hard-surface modeling",
    "Creature sculpting",
    "PBR texturing",
    "Realtime optimization",
    "Look development",
  ],
  softwareList: ["Blender", "Substance Painter", "ZBrush", "Marmoset Toolbag", "Unreal Engine"],
  socialLinks: [
    { label: "LinkedIn", url: "https://linkedin.com" },
    { label: "ArtStation", url: "https://artstation.com" },
    { label: "Behance", url: "https://behance.net" },
    { label: "Instagram", url: "https://instagram.com" },
  ],
};
