import Link from "next/link";
import { ArrowRight, Boxes, Download, ShieldCheck, Sparkles } from "lucide-react";

import { AboutSection } from "@/components/about-section";
import { ContactSection } from "@/components/contact-section";
import { PortfolioSection } from "@/components/portfolio-section";
import { ProjectCard } from "@/components/project-card";
import { SiteNavbar } from "@/components/site-navbar";
import { buttonVariants } from "@/components/ui/button";
import {
  getAllProjects,
  getFeaturedProjects,
  getCreatorProfile,
  toProjectPreview,
} from "@/lib/projects";

export default async function Home() {
  const [allProjects, featuredProjects, profile] = await Promise.all([
    getAllProjects(),
    getFeaturedProjects(),
    getCreatorProfile(),
  ]);

  const portfolioPreviews = allProjects.map(toProjectPreview);
  const featuredPreviews = featuredProjects.map(toProjectPreview).slice(0, 3);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#060b12] text-zinc-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_45%_at_18%_0%,rgba(6,182,212,0.18),transparent_72%),radial-gradient(55%_35%_at_84%_7%,rgba(251,191,36,0.14),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:36px_36px] opacity-15" />

      <SiteNavbar />

      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-14 px-4 pb-16 sm:px-6 lg:gap-18 lg:px-8">
        <section id="home" className="scroll-mt-24 pt-12 sm:pt-16">
          <div className="grid items-start gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
            <div className="space-y-6">
              <p className="inline-flex items-center gap-2 rounded-full border border-cyan-200/30 bg-cyan-200/10 px-3 py-1 text-xs tracking-[0.15em] text-cyan-100 uppercase">
                <Sparkles className="size-3.5" />
                3D Asset Portfolio
              </p>

              <div className="space-y-4">
                <h1 className="font-heading text-4xl leading-tight font-semibold text-white sm:text-5xl lg:text-6xl">
                  {profile.name} . {profile.roleTitle}
                </h1>
                <p className="max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
                  {profile.bioShort} Portfolio ini dirancang untuk recruiter dan client
                  agar bisa evaluasi style visual, kualitas teknis, dan kesiapan pipeline secara
                  cepat.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#portfolio"
                  className={buttonVariants({
                    size: "lg",
                    className:
                      "border border-cyan-200/45 bg-cyan-200/15 text-cyan-50 hover:bg-cyan-200/25",
                  })}
                >
                  View Portfolio
                  <ArrowRight className="size-4" />
                </a>
                <a
                  href="#contact"
                  className={buttonVariants({
                    size: "lg",
                    variant: "outline",
                    className:
                      "border-white/25 bg-white/[0.02] text-zinc-100 hover:bg-white/[0.08]",
                  })}
                >
                  Contact
                </a>
                <a
                  href="/Hilmi_CV.pdf"
                  download
                  className={buttonVariants({
                    size: "lg",
                    variant: "outline",
                    className:
                      "border-white/25 bg-white/[0.02] text-zinc-100 hover:bg-white/[0.08]",
                  })}
                >
                  <Download className="size-4" />
                  Download CV
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-white/15 bg-zinc-950/70 p-5 shadow-[0_18px_60px_-35px_rgba(34,211,238,0.45)] backdrop-blur">
              <h2 className="font-heading text-lg font-semibold text-white">Quick Snapshot</h2>
              <div className="mt-4 grid gap-3">
                <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                  <p className="text-xs text-zinc-400">Total Assets</p>
                  <p className="text-2xl font-semibold text-white">{allProjects.length}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                  <p className="text-xs text-zinc-400">Primary Focus</p>
                  <p className="text-sm font-medium text-zinc-100">Creature, Environment, Props</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                  <p className="text-xs text-zinc-400">Availability</p>
                  <p className="text-sm font-medium text-zinc-100">Open for freelance and studio roles</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium tracking-[0.18em] text-cyan-200/80 uppercase">
                Featured Projects
              </p>
              <h2 className="font-heading text-2xl font-semibold text-white sm:text-3xl">
                Highlighted Work
              </h2>
            </div>
            <Link
              href="#portfolio"
              className="inline-flex items-center gap-1 text-sm text-cyan-100 hover:text-cyan-50"
            >
              Lihat semua aset
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
        <AboutSection />
        <ContactSection
          email={profile.email}
          location={profile.location}
          socialLinks={profile.socialLinks}
        />
      </main>

      <footer className="relative z-10 border-t border-white/10 bg-black/35 py-5">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 text-xs text-zinc-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p className="inline-flex items-center gap-2">
            <ShieldCheck className="size-3.5 text-cyan-200" />
            Frontend MVP portfolio built with Next.js, Tailwind, shadcn/ui.
          </p>
          <p className="inline-flex items-center gap-2">
            <Boxes className="size-3.5 text-amber-200" />
            3D model source: <code>/3D-ASSET</code>
          </p>
        </div>
      </footer>
    </div>
  );
}
