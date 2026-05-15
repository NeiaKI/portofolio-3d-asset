import { ImageResponse } from "next/og";
import { getProjectBySlug } from "@/lib/projects";
import { CATEGORY_LABELS } from "@/lib/portfolio-shared";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const categoryGradient: Record<string, string> = {
  props: "rgba(251,191,36,0.25), rgba(234,88,12,0.15)",
  environment: "rgba(6,182,212,0.25), rgba(99,102,241,0.15)",
  character: "rgba(52,211,153,0.25), rgba(6,182,212,0.15)",
  vehicle: "rgba(250,204,21,0.25), rgba(6,182,212,0.15)",
  other: "rgba(113,113,122,0.25), rgba(100,116,139,0.15)",
};

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  const gradient = project ? (categoryGradient[project.category] ?? categoryGradient.other) : categoryGradient.other;
  const title = project?.title ?? "3D Asset";
  const category = project ? CATEGORY_LABELS[project.category] : "Asset";
  const description = project?.descriptionShort ?? "";

  return new ImageResponse(
    (
      <div style={{ background: "#09090b", width: "100%", height: "100%", display: "flex", fontFamily: "sans-serif", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "600px", height: "600px", background: `radial-gradient(ellipse, ${gradient}, transparent 70%)` }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "60px 72px", width: "100%", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ color: "#22d3ee", fontSize: "16px", letterSpacing: "0.2em", textTransform: "uppercase" }}>HILMI 3D Lab</div>
            <div style={{ color: "#3f3f46", fontSize: "16px" }}>·</div>
            <div style={{ background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.3)", borderRadius: "999px", padding: "4px 14px", color: "#22d3ee", fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase" }}>{category}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ color: "#ffffff", fontSize: title.length > 20 ? "64px" : "80px", fontWeight: 700, letterSpacing: "-2px", lineHeight: 1.05, maxWidth: "800px" }}>{title}</div>
            {description && <div style={{ color: "#71717a", fontSize: "22px", maxWidth: "700px", lineHeight: 1.4 }}>{description}</div>}
          </div>
          <div style={{ display: "flex", gap: "24px" }}>
            {project && (
              <>
                <div style={{ color: "#52525b", fontSize: "14px" }}>Format: <span style={{ color: "#a1a1aa" }}>.glb</span></div>
                <div style={{ color: "#52525b", fontSize: "14px" }}>Polycount: <span style={{ color: "#a1a1aa" }}>{project.polycount}</span></div>
                <div style={{ color: "#52525b", fontSize: "14px" }}>Year: <span style={{ color: "#a1a1aa" }}>{project.year}</span></div>
              </>
            )}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
