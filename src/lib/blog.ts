import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type BlogPostMeta = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags?: string[];
  coverImage?: string;
};

export type BlogPost = BlogPostMeta & {
  content: string;
};

export const getAllPostMetas = cache(async (): Promise<BlogPostMeta[]> => {
  let files: string[];
  try {
    files = await fs.readdir(BLOG_DIR);
  } catch {
    return [];
  }

  const metas = await Promise.all(
    files
      .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
      .map(async (file) => {
        const raw = await fs.readFile(path.join(BLOG_DIR, file), "utf-8");
        const { data } = matter(raw);
        const slug = file.replace(/\.(mdx|md)$/, "");
        return {
          slug,
          title: (data.title as string) ?? slug,
          date: (data.date as string) ?? "",
          excerpt: (data.excerpt as string) ?? "",
          tags: data.tags as string[] | undefined,
          coverImage: data.coverImage as string | undefined,
        } satisfies BlogPostMeta;
      }),
  );

  return metas.sort((a, b) => b.date.localeCompare(a.date));
});

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  for (const ext of ["mdx", "md"]) {
    const filePath = path.join(BLOG_DIR, `${slug}.${ext}`);
    try {
      const raw = await fs.readFile(filePath, "utf-8");
      const { data, content } = matter(raw);
      return {
        slug,
        title: (data.title as string) ?? slug,
        date: (data.date as string) ?? "",
        excerpt: (data.excerpt as string) ?? "",
        tags: data.tags as string[] | undefined,
        coverImage: data.coverImage as string | undefined,
        content,
      };
    } catch {
      continue;
    }
  }
  return null;
}
