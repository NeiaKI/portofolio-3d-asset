import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { I18nProvider } from "@/components/providers/i18n-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://digital-entrepreneurship.vercel.app";

export const metadata: Metadata = {
  title: "HILMI 3D Portfolio",
  description:
    "Portfolio 3D asset interaktif oleh Hilmi — creature, environment, dan props siap pakai untuk game dan realtime rendering.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "HILMI 3D Portfolio",
    description:
      "Portfolio 3D asset interaktif oleh Hilmi — creature, environment, dan props siap pakai untuk game dan realtime rendering.",
    type: "website",
    locale: "id_ID",
    siteName: "HILMI 3D Portfolio",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "HILMI 3D Lab" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "HILMI 3D Portfolio",
    description:
      "Portfolio 3D asset interaktif oleh Hilmi — creature, environment, dan props siap pakai untuk game dan realtime rendering.",
    images: ["/opengraph-image"],
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Hilmi",
  url: siteUrl,
  jobTitle: "3D Environment & Creature Artist",
  description: "Membangun aset 3D stylized-realistic untuk game, cinematic, dan visual storytelling.",
  knowsAbout: ["3D Modeling", "Creature Sculpting", "PBR Texturing", "Blender", "ZBrush", "Substance Painter"],
  sameAs: ["https://artstation.com", "https://linkedin.com"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <I18nProvider>
            {children}
          </I18nProvider>
          <Toaster position="bottom-right" richColors closeButton />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
