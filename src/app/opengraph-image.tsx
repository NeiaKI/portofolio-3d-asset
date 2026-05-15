import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#09090b",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        <div style={{ position: "absolute", top: 0, left: "10%", width: "600px", height: "320px", background: "radial-gradient(ellipse, rgba(6,182,212,0.18) 0%, transparent 70%)" }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.3)", borderRadius: "999px", padding: "6px 20px", color: "#22d3ee", fontSize: "14px", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            3D Asset Portfolio
          </div>
          <div style={{ color: "#ffffff", fontSize: "80px", fontWeight: 700, letterSpacing: "-2px", lineHeight: 1 }}>HILMI 3D Lab</div>
          <div style={{ color: "#71717a", fontSize: "24px", letterSpacing: "0.05em" }}>Creature · Environment · Props</div>
          <div style={{ marginTop: "12px", display: "flex", gap: "24px" }}>
            {["Blender", "Substance Painter", "ZBrush"].map((s) => (
              <div key={s} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "6px 16px", color: "#a1a1aa", fontSize: "14px" }}>{s}</div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
