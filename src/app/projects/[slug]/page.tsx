import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectDetailClient } from "@/components/project-detail-client";
import { getAllProjects, getProjectBySlug } from "@/lib/projects";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} | 3D Portfolio`,
    description: project.descriptionShort,
    openGraph: {
      title: `${project.title} | 3D Portfolio`,
      description: project.descriptionShort,
      type: "website",
      ...(project.thumbnailImageUrl && {
        images: [{ url: project.thumbnailImageUrl, alt: project.title }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | 3D Portfolio`,
      description: project.descriptionShort,
      ...(project.thumbnailImageUrl && { images: [project.thumbnailImageUrl] }),
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetailClient project={project} />;
}
