"use client";

import Link from "next/link";
import { ArrowRight, Boxes, Download, ShieldCheck, Sparkles } from "lucide-react";

import { AboutSection } from "@/components/about-section";
import { ContactSection } from "@/components/contact-section";
import { PortfolioSection } from "@/components/portfolio-section";
import { ProjectCard } from "@/components/project-card";
import { SiteNavbar } from "@/components/site-navbar";
import { buttonVariants } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import type { PortfolioProjectPreview, CreatorProfile } from "@/lib/portfolio-shared";

type HomeClientProps = {
  allProjects: PortfolioProjectPreview[];
  featuredPreviews: PortfolioProjectPreview[];
  portfolioPreviews: PortfolioProjectPreview[];
  profile: CreatorProfile;
};

export function HomeClient({
  allProjects,
  featuredPreviews,
  portfolioPreviews,
  profile,
}: HomeClientProps) {
  const { t } = useI18n();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_45%_at_18%_0%,rgba(6,182,212,0.18),transparent_72%),radial-gradient(55%_35%_at_84%_7%,rgba(251,191,36,0.14),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:36px_36px] opacity-15" />

      <SiteNavbar />

      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-14 px-4 pb-16 sm:px-6 lg:gap-18 lg:px-8">
        <section id="home" className="scroll-mt-24 pt-12 sm:pt-16">
          <div className="grid items-start gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
            <div className="space-y-6">
              <p className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs tracking-[0.15em] text-cyan-700 dark:border-cyan-200/30 dark:bg-cyan-200/10 dark:text-cyan-100 uppercase">
                <Sparkles className="size-3.5" />
                {t("hero.tag")}
              </p>

              <div className="space-y-4">
                <h1 className="font-heading text-4xl leading-tight font-semibold text-foreground sm:text-5xl lg:text-6xl">
                  {profile.name} . {profile.roleTitle}
                </h1>
                <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                  {profile.bioShort} {t("hero.bioSuffix")}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#portfolio"
                  className={buttonVariants({
                    size: "lg",
                    className:
                      "border border-cyan-500/45 bg-cyan-500/15 text-cyan-700 dark:border-cyan-200/45 dark:bg-cyan-200/15 dark:text-cyan-50 hover:bg-cyan-500/25",
                  })}
                >
                  {t("hero.viewPortfolio")}
                  <ArrowRight className="size-4" />
                </a>
                <a
                  href="#contact"
                  className={buttonVariants({
                    size: "lg",
                    variant: "outline",
                    className: "border-border bg-muted/20 text-foreground hover:bg-muted/40",
                  })}
                >
                  {t("hero.contact")}
                </a>
                <a
                  href="/Hilmi_CV.pdf"
                  download
                  className={buttonVariants({
                    size: "lg",
                    variant: "outline",
                    className: "border-border bg-muted/20 text-foreground hover:bg-muted/40",
                  })}
                >
                  <Download className="size-4" />
                  {t("hero.downloadCv")}
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_18px_60px_-35px_rgba(34,211,238,0.35)] backdrop-blur">
              <h2 className="font-heading text-lg font-semibold text-card-foreground">{t("snapshot.title")}</h2>
              <div className="mt-4 grid gap-3">
                <div className="rounded-lg border border-border bg-muted/20 p-3">
                  <p className="text-xs text-muted-foreground">{t("snapshot.totalAssets")}</p>
                  <p className="text-2xl font-semibold text-foreground">{allProjects.length}</p>
                </div>
                <div className="rounded-lg border border-border bg-muted/20 p-3">
                  <p className="text-xs text-muted-foreground">{t("snapshot.primaryFocus")}</p>
                  <p className="text-sm font-medium text-foreground">{t("snapshot.focusValue")}</p>
                </div>
                <div className="rounded-lg border border-border bg-muted/20 p-3">
                  <p className="text-xs text-muted-foreground">{t("snapshot.availability")}</p>
                  <p className="text-sm font-medium text-foreground">{t("snapshot.availabilityValue")}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium tracking-[0.18em] text-cyan-600 dark:text-cyan-200/80 uppercase">
                {t("featured.label")}
              </p>
              <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
                {t("featured.title")}
              </h2>
            </div>
            <Link
              href="#portfolio"
              className="inline-flex items-center gap-1 text-sm text-cyan-600 dark:text-cyan-100 hover:text-cyan-700 dark:hover:text-cyan-50"
            >
              {t("featured.viewAll")}
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featuredPreviews.map((project) => (
              <ProjectCard key={project.id} project={project} priority />
            ))}
          </div>
        </section>

        <PortfolioSection projects={portfolioPreviews} />
        <AboutSection profile={profile} />
        <ContactSection
          email={profile.email}
          location={profile.location}
          socialLinks={profile.socialLinks}
        />
      </main>

      <footer className="relative z-10 border-t border-border bg-background/80 py-5">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p className="inline-flex items-center gap-2">
            <ShieldCheck className="size-3.5 text-cyan-500 dark:text-cyan-200" />
            {t("footer.built")}
          </p>
          <p className="inline-flex items-center gap-2">
            <Boxes className="size-3.5 text-amber-500 dark:text-amber-200" />
            {t("footer.source")} <code>/3D-ASSET</code>
          </p>
        </div>
      </footer>
    </div>
  );
}
