import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, BookOpen, Tag } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteNavbar } from "@/components/site-navbar";
import { getAllPostMetas } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — HILMI 3D Lab",
  description: "Process breakdown, WIP sculpting stages, dan catatan teknis dari project 3D asset.",
};

export default async function BlogPage() {
  const posts = await getAllPostMetas();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_45%_at_18%_0%,rgba(6,182,212,0.12),transparent_72%),radial-gradient(55%_35%_at_84%_7%,rgba(251,191,36,0.10),transparent_70%)]" />
      <SiteNavbar />
      <main className="relative z-10 mx-auto w-full max-w-4xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 rounded-md border border-border bg-muted/20 px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/40"
        >
          <ArrowLeft className="size-4" />
          Kembali ke Portfolio
        </Link>

        <section className="mb-10 space-y-3">
          <p className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs tracking-[0.15em] text-cyan-700 dark:border-cyan-200/30 dark:bg-cyan-200/10 dark:text-cyan-100 uppercase">
            <BookOpen className="size-3.5" />
            Blog
          </p>
          <h1 className="font-heading text-4xl font-semibold text-foreground sm:text-5xl">
            Process Breakdown
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground">
            Wireframe, sculpt stages, before/after texture — dokumentasi proses di balik setiap aset.
          </p>
        </section>

        {posts.length === 0 ? (
          <div className="rounded-xl border border-border bg-card px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground">Belum ada artikel. Coming soon.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                <Card className="border-border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-500/40 dark:hover:border-cyan-200/40">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-4">
                      <CardTitle className="text-lg leading-snug text-foreground group-hover:text-cyan-600 dark:group-hover:text-cyan-200 transition-colors">
                        {post.title}
                      </CardTitle>
                      <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                    {post.date && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(post.date).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {post.excerpt && (
                      <p className="text-sm leading-6 text-muted-foreground">{post.excerpt}</p>
                    )}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Tag className="size-3 text-muted-foreground" />
                        {post.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="border-border text-xs text-muted-foreground"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
