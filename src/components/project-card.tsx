"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Box, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORY_LABELS, type PortfolioProjectPreview } from "@/lib/portfolio-shared";
import { ModelPreview } from "@/components/model-preview";

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
  const [isHovered, setIsHovered] = useState(false);
  const categoryLabel = CATEGORY_LABELS[project.category];
  
  // Show preview if it's a priority (featured) project OR if user is hovering
  const showPreview = priority || isHovered;

  return (
    <Card
      className="group relative overflow-hidden border-white/10 bg-zinc-950/80 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-cyan-200/45"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`relative w-full overflow-hidden border-b border-white/10 bg-gradient-to-br transition-all duration-500 ease-in-out ${
          isHovered ? "h-56" : "h-48"
        } ${categoryColorMap[project.category]}`}
      >
        {/* Thumbnail: shown when not in 3D preview mode */}
        {project.thumbnailImageUrl && !showPreview && (
          <Image
            src={project.thumbnailImageUrl}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover"
          />
        )}

        {/* Background treatment */}
        {!project.thumbnailImageUrl && (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_65%)]" />
        )}
        {project.thumbnailImageUrl && !showPreview && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        )}

        {/* 3D Preview */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${
            showPreview ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {showPreview && <ModelPreview modelUrl={project.modelUrl} />}
        </div>

        <div className="absolute -right-8 -bottom-10 h-36 w-36 rounded-full border border-white/20" />
        <div className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-2.5 py-1 text-[10px] font-medium tracking-tight text-zinc-100 backdrop-blur-md transition-all group-hover:border-cyan-400/50 group-hover:bg-cyan-950/40">
          <Sparkles className={`size-3 text-cyan-200 ${showPreview ? "animate-pulse" : ""}`} />
          {priority ? "Highlighted Work" : isHovered ? "Interacting..." : "Hover for 3D"}
        </div>

        {!showPreview && (
          <div className="absolute inset-x-4 bottom-4 flex items-end justify-between transition-opacity duration-300 pointer-events-none">
            <p className="font-heading text-lg font-semibold text-white drop-shadow-md">{project.title}</p>
            <ArrowUpRight className="size-5 text-cyan-100 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        )}
      </div>

      <CardHeader className="gap-3 transition-all duration-300">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-white/10 text-zinc-100 hover:bg-white/20">{categoryLabel}</Badge>
          <Badge variant="outline" className="border-white/20 text-zinc-300">
            {project.year}
          </Badge>
          {priority ? (
            <Badge className="bg-cyan-300/20 text-cyan-100 hover:bg-cyan-300/30">Featured</Badge>
          ) : null}
        </div>
        <CardTitle className="text-base leading-snug text-zinc-100">{project.descriptionShort}</CardTitle>
      </CardHeader>

      <CardContent className="flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5 text-xs text-zinc-400">
          <Box className="size-3.5" />
          <span>{project.sizeMb.toFixed(1)} MB .glb</span>
        </div>
        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-cyan-100 transition-colors hover:text-cyan-50"
        >
          Open Detail
          <ArrowUpRight className="size-3.5" />
        </Link>
      </CardContent>
    </Card>
  );
}
