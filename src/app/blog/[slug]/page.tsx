import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Tag } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";

import { Badge } from "@/components/ui/badge";
import { SiteNavbar } from "@/components/site-navbar";
import { getAllPostMetas, getPostBySlug } from "@/lib/blog";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getAllPostMetas();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} — HILMI 3D Lab`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_45%_at_18%_0%,rgba(6,182,212,0.12),transparent_72%)]" />
      <SiteNavbar />
      <main className="relative z-10 mx-auto w-full max-w-3xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-2 rounded-md border border-border bg-muted/20 px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/40"
        >
          <ArrowLeft className="size-4" />
          Semua Artikel
        </Link>

        <article className="space-y-6">
          <header className="space-y-3">
            {post.date && (
              <p className="text-xs text-muted-foreground">
                {new Date(post.date).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
            <h1 className="font-heading text-3xl font-semibold text-foreground sm:text-4xl leading-tight">
              {post.title}
            </h1>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <Tag className="size-3.5 text-muted-foreground" />
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
          </header>

          <div className="prose prose-sm prose-zinc dark:prose-invert max-w-none prose-headings:font-heading prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-7 prose-strong:text-foreground prose-a:text-cyan-600 dark:prose-a:text-cyan-300 prose-code:text-cyan-700 dark:prose-code:text-cyan-200 prose-code:bg-muted/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-blockquote:border-cyan-500/40 prose-blockquote:text-muted-foreground prose-li:text-muted-foreground">
            <MDXRemote source={post.content} />
          </div>
        </article>
      </main>
    </div>
  );
}
