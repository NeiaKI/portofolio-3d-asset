import { HomeClient } from "@/components/home-client";
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
    <HomeClient
      allProjects={allProjects.map(toProjectPreview)}
      featuredPreviews={featuredPreviews}
      portfolioPreviews={portfolioPreviews}
      profile={profile}
    />
  );
}
