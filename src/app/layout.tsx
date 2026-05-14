import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { I18nProvider } from "@/components/providers/i18n-provider";
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

export const metadata: Metadata = {
  title: "HILMI 3D Portfolio",
  description: "Portfolio 3D asset interaktif oleh Hilmi — creature, environment, dan props siap pakai untuk game dan realtime rendering.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://digital-entrepreneurship.vercel.app"),
  openGraph: {
    title: "HILMI 3D Portfolio",
    description: "Portfolio 3D asset interaktif oleh Hilmi — creature, environment, dan props siap pakai untuk game dan realtime rendering.",
    type: "website",
    locale: "id_ID",
    siteName: "HILMI 3D Portfolio",
  },
  twitter: {
    card: "summary",
    title: "HILMI 3D Portfolio",
    description: "Portfolio 3D asset interaktif oleh Hilmi — creature, environment, dan props siap pakai untuk game dan realtime rendering.",
  },
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
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <I18nProvider>
            {children}
          </I18nProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
