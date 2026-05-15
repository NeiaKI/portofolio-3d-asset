"use client";

import { useEffect, useMemo, useState } from "react";

import { ProjectCard } from "@/components/project-card";
import { PortfolioGridSkeleton } from "@/components/portfolio-skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/lib/i18n";
import {
  CATEGORY_LABELS,
  PROJECT_CATEGORIES,
  type PortfolioProjectPreview,
  type ProjectCategory,
} from "@/lib/portfolio-shared";

type PortfolioSectionProps = {
  projects: PortfolioProjectPreview[];
};

type FilterValue = "all" | ProjectCategory;

export function PortfolioSection({ projects }: PortfolioSectionProps) {
  const { t } = useI18n();
  const [activeCategory, setActiveCategory] = useState<FilterValue>("all");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // Restore category from sessionStorage on mount
  useEffect(() => {
    const savedCategory = sessionStorage.getItem("portfolio-active-category") as FilterValue;
    if (savedCategory && (savedCategory === "all" || PROJECT_CATEGORIES.includes(savedCategory as ProjectCategory))) {
      setActiveCategory(savedCategory);
    }
  }, []);

  const handleCategoryChange = (value: string) => {
    const category = value as FilterValue;
    setActiveCategory(category);
    sessionStorage.setItem("portfolio-active-category", category);
  };

  const visibleProjects = useMemo(() => {
    if (activeCategory === "all") {
      return projects;
    }

    return projects.filter((project) => project.category === activeCategory);
  }, [activeCategory, projects]);

  const countByCategory = useMemo(() => {
    return PROJECT_CATEGORIES.reduce<Record<ProjectCategory, number>>(
      (acc, category) => {
        acc[category] = projects.filter((project) => project.category === category).length;
        return acc;
      },
      {
        props: 0,
        environment: 0,
        character: 0,
        vehicle: 0,
        other: 0,
      },
    );
  }, [projects]);

  const totalCount = projects.length;

  return (
    <section id="portfolio" className="scroll-mt-24 space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-medium tracking-[0.18em] text-cyan-600 dark:text-cyan-200/80 uppercase">
            {t("portfolio.label")}
          </p>
          <h2 className="font-heading text-3xl font-semibold text-foreground sm:text-4xl">
            {t("portfolio.title")}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {t("portfolio.subtitle")}
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{visibleProjects.length}</span>{" "}
          {t("portfolio.showing")}{" "}
          <span className="font-medium text-foreground">{totalCount}</span>{" "}
          {t("portfolio.total")}
        </p>
      </div>

      <Tabs value={activeCategory} onValueChange={handleCategoryChange}>
        <TabsList
          variant="line"
          className="h-auto w-full flex-wrap items-center justify-start gap-2 rounded-xl border border-border bg-muted/30 p-2"
        >
          <TabsTrigger value="all" className="rounded-lg border border-border px-3 py-1.5 text-xs">
            {t("category.all")} ({totalCount})
          </TabsTrigger>
          {PROJECT_CATEGORIES.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              className="rounded-lg border border-border px-3 py-1.5 text-xs"
            >
              {CATEGORY_LABELS[category]} ({countByCategory[category]})
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory} className="mt-4">
          {!hydrated ? (
            <PortfolioGridSkeleton count={Math.min(projects.length, 6)} />
          ) : visibleProjects.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visibleProjects.map((project) => (
                <ProjectCard key={project.id} project={project} priority={project.isFeatured} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center text-muted-foreground">
              {t("portfolio.empty")}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
}
