"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Box, Cpu, Download, HardDrive, ImageIcon, Layers, ShoppingBag, Workflow } from "lucide-react";

const ModelViewer = dynamic(
  () => import("@/components/model-viewer").then((m) => ({ default: m.ModelViewer })),
  {
    ssr: false,
    loading: () => (
      <div className="h-[340px] w-full animate-pulse rounded-xl bg-card/80 sm:h-[460px]" />
    ),
  },
);

const MARKETPLACE_ICONS: Record<string, string> = {
  sketchfab: "S",
  cgtrader: "C",
  artstation: "A",
  other: "\u2192",
};
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORY_LABELS } from "@/lib/portfolio-shared";
import { useI18n } from "@/lib/i18n";
import type { PortfolioProject } from "@/lib/portfolio-shared";

type ProjectDetailClientProps = {
  project: PortfolioProject;
};

export function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const { t } = useI18n();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/#portfolio"
            className={buttonVariants({
              variant: "outline",
              className: "border-border bg-muted/20",
            })}
          >
            <ArrowLeft className="size-4" />
            {t("project.backToPortfolio")}
          </Link>
          <p className="text-xs text-muted-foreground">
            {t("project.source")} {project.sourcePath}
          </p>
        </div>

        <section className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-cyan-500/15 text-cyan-700 dark:bg-cyan-200/15 dark:text-cyan-100 hover:bg-cyan-500/20">
              {CATEGORY_LABELS[project.category]}
            </Badge>
            <Badge variant="outline" className="border-border text-muted-foreground">
              {project.year}
            </Badge>
          </div>
          <h1 className="font-heading text-3xl leading-tight font-semibold text-foreground sm:text-4xl">
            {project.title}
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
            {project.descriptionLong}
          </p>
        </section>

        {/* Hero image */}
        {project.heroImageUrl && (
          <div className="overflow-hidden rounded-xl border border-border">
            <Image
              src={project.heroImageUrl}
              alt={`${project.title} hero render`}
              width={1200}
              height={480}
              className="w-full object-cover"
              priority
            />
          </div>
        )}

        <ModelViewer modelUrl={project.modelUrl} title={project.title} sizeMb={project.sizeMb} />

        <section className="grid gap-4 lg:grid-cols-2">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="inline-flex items-center gap-2 text-card-foreground">
                <Cpu className="size-4 text-cyan-500 dark:text-cyan-200" />
                {t("project.techInfo")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p className="inline-flex items-center gap-2">
                <HardDrive className="size-4 text-muted-foreground" />
                {t("project.format")} <span className="font-medium text-foreground">.glb</span>
                <span className="ml-2 rounded bg-muted/50 px-1.5 py-0.5 text-xs font-medium text-foreground">
                  {project.sizeMb} MB
                </span>
              </p>
              <p className="inline-flex items-center gap-2">
                <Box className="size-4 text-muted-foreground" />
                {t("project.polycount")}{" "}
                <span className="font-medium text-foreground">{project.polycount}</span>
              </p>
              <p className="inline-flex items-center gap-2">
                <Layers className="size-4 text-muted-foreground" />
                {t("project.texture")}{" "}
                <span className="font-medium text-foreground">{project.textureResolution}</span>
              </p>
              <p className="inline-flex items-center gap-2">
                <Workflow className="size-4 text-muted-foreground" />
                {t("project.pipeline")}{" "}
                <span className="font-medium text-foreground">{project.pipeline}</span>
              </p>
              {project.blendFileUrl && (
                <a
                  href={project.blendFileUrl}
                  download
                  className="mt-1 inline-flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-medium text-foreground transition-colors hover:border-cyan-500/30 hover:bg-cyan-500/5"
                >
                  <Download className="size-3.5 text-cyan-500 dark:text-cyan-200" />
                  {t("project.downloadBlend")}
                </a>
              )}
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground">{t("project.softwareUsed")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {project.softwareUsed.map((software) => (
                  <Badge key={software} variant="outline" className="border-border text-muted-foreground">
                    {software}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Marketplace links */}
        {project.marketplaceLinks && project.marketplaceLinks.length > 0 && (
          <section className="space-y-4">
            <h2 className="inline-flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
              <ShoppingBag className="size-4 text-cyan-500 dark:text-cyan-200" />
              Tersedia di Marketplace
            </h2>
            <div className="flex flex-wrap gap-3">
              {project.marketplaceLinks.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/20 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-cyan-500/30 hover:bg-cyan-500/[0.06]"
                >
                  <span className="inline-flex size-5 items-center justify-center rounded bg-cyan-500/15 text-xs font-bold text-cyan-600 dark:text-cyan-200">
                    {MARKETPLACE_ICONS[link.platform] ?? "\u2192"}
                  </span>
                  {link.label}
                  <ArrowUpRight className="size-3.5 text-muted-foreground" />
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Gallery images */}
        {project.galleryImageUrls && project.galleryImageUrls.length > 0 && (
          <section className="space-y-4">
            <h2 className="inline-flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
              <ImageIcon className="size-4 text-cyan-500 dark:text-cyan-200" />
              {t("project.gallery")}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {project.galleryImageUrls.map((url, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative block h-48 overflow-hidden rounded-xl border border-border transition-colors hover:border-cyan-500/30"
                >
                  <Image
                    src={url}
                    alt={`${project.title} render ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
