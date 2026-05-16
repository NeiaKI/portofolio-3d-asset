"use client";

import { useEffect, useRef, useState, Component, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Box, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORY_LABELS, type PortfolioProjectPreview } from "@/lib/portfolio-shared";
import { ModelPreview } from "@/components/model-preview";
import { useI18n } from "@/lib/i18n";
import { acquireWebGLSlot } from "@/lib/webgl-slots";

class ModelErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

type ProjectCardProps = {
  project: PortfolioProjectPreview;
  priority?: boolean;
};

const categoryColorMap = {
  props: "from-amber-400/35 via-orange-400/20 to-red-400/20",
  environment: "from-cyan-400/30 via-sky-500/20 to-indigo-500/20",
  character: "from-emerald-400/30 via-cyan-400/20 to-teal-500/20",
  vehicle: "from-yellow-400/30 via-amber-400/20 to-cyan-400/20",
  other: "from-zinc-500/35 via-zinc-400/20 to-slate-500/20",
} as const;

export function ProjectCard({ project, priority = false }: ProjectCardProps) {
  const { t } = useI18n();
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasSlot, setHasSlot] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const categoryLabel = CATEGORY_LABELS[project.category];

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const wantPreview = isInView || isHovered;
  useEffect(() => {
    if (!wantPreview) {
      setHasSlot(false);
      return;
    }
    const release = acquireWebGLSlot(() => setHasSlot(true));
    return () => {
      setHasSlot(false);
      release();
    };
  }, [wantPreview]);

  const showPreview = hasSlot;
  const labelText = priority
    ? t("project.highlighted")
    : showPreview
    ? t("project.interacting")
    : t("project.hoverFor3d");

  return (
    <div ref={wrapperRef}>
      <Card
        className="group relative overflow-hidden border-border bg-card backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/45 dark:hover:border-cyan-200/45"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`relative w-full overflow-hidden border-b border-border bg-gradient-to-br transition-all duration-500 ease-in-out ${
            isHovered ? "h-56" : "h-48"
          } ${categoryColorMap[project.category]}`}
        >
          {project.thumbnailImageUrl && !showPreview && (
            <Image
              src={project.thumbnailImageUrl}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="object-cover"
            />
          )}

          {!project.thumbnailImageUrl && (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_65%)]" />
          )}
          <div
            className={`absolute inset-0 transition-opacity duration-700 ${
              showPreview ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {showPreview && (
              <ModelErrorBoundary
                fallback={
                  <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground">
                    Preview unavailable
                  </div>
                }
              >
                <ModelPreview modelUrl={project.previewUrl ?? project.modelUrl} />
              </ModelErrorBoundary>
            )}
          </div>

          {/* gradient supaya nama tetap terbaca di atas thumbnail maupun 3D */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          <div className="absolute -right-8 -bottom-10 h-36 w-36 rounded-full border border-white/20" />
          <div className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full border border-white/20 bg-background/50 px-2.5 py-1 text-[10px] font-medium tracking-tight text-foreground backdrop-blur-md transition-all group-hover:border-cyan-400/50 group-hover:bg-cyan-950/40 dark:text-zinc-100">
            <Sparkles className={`size-3 text-cyan-500 dark:text-cyan-200 ${showPreview ? "animate-pulse" : ""}`} />
            {labelText}
          </div>

          <div className="absolute inset-x-4 bottom-4 z-10 flex items-end justify-between pointer-events-none">
            <p className="font-heading text-lg font-semibold text-white drop-shadow-md">{project.title}</p>
            <ArrowUpRight className="size-5 text-cyan-100 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>

        <CardHeader className="gap-3 transition-all duration-300">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-muted/40 text-foreground hover:bg-muted/60">{categoryLabel}</Badge>
            <Badge variant="outline" className="border-border text-muted-foreground">
              {project.year}
            </Badge>
            {priority ? (
              <Badge className="bg-cyan-500/20 text-cyan-700 dark:bg-cyan-300/20 dark:text-cyan-100 hover:bg-cyan-500/30">
                Featured
              </Badge>
            ) : null}
          </div>
          <CardTitle className="text-base leading-snug text-foreground">{project.descriptionShort}</CardTitle>
        </CardHeader>

        <CardContent className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Box className="size-3.5" />
            <span>{project.sizeMb.toFixed(1)} MB .glb</span>
          </div>
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-cyan-600 dark:text-cyan-100 transition-colors hover:text-cyan-700 dark:hover:text-cyan-50"
          >
            {t("project.openDetail")}
            <ArrowUpRight className="size-3.5" />
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
