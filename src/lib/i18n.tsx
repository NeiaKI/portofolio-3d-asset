"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Locale = "id" | "en";

const translations = {
  id: {
    "nav.home": "Home",
    "nav.portfolio": "Portfolio",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.viewPortfolio": "View Portfolio",
    "nav.commission": "Commission",
    "nav.navigate": "Navigasi",

    "hero.tag": "3D Asset Portfolio",
    "hero.bioSuffix":
      "Portfolio ini dirancang untuk recruiter dan client agar bisa evaluasi style visual, kualitas teknis, dan kesiapan pipeline secara cepat.",
    "hero.viewPortfolio": "View Portfolio",
    "hero.contact": "Contact",
    "hero.downloadCv": "Download CV",

    "snapshot.title": "Quick Snapshot",
    "snapshot.totalAssets": "Total Assets",
    "snapshot.primaryFocus": "Primary Focus",
    "snapshot.availability": "Availability",
    "snapshot.focusValue": "Creature, Environment, Props",
    "snapshot.availabilityValue": "Open for freelance and studio roles",

    "featured.label": "Featured Projects",
    "featured.title": "Highlighted Work",
    "featured.viewAll": "Lihat semua aset",

    "portfolio.label": "Portfolio Grid",
    "portfolio.title": "Explore 3D Assets",
    "portfolio.subtitle":
      "Filter berdasarkan kategori untuk menemukan prop, environment, atau character yang paling relevan dengan kebutuhan project kamu.",
    "portfolio.showing": "terlihat dari",
    "portfolio.of": "dari",
    "portfolio.total": "total aset",
    "portfolio.empty": "Belum ada aset pada kategori ini.",

    "about.label": "About",
    "about.title": "Artist Profile",
    "about.coreSkills": "Core Skills",
    "about.softwareStack": "Software Stack",

    "contact.label": "Contact",
    "contact.title": "Let's Collaborate",
    "contact.subtitle":
      "Kirim detail project lewat form berikut atau hubungi langsung lewat link sosial di bawah.",
    "contact.form": "Contact Form",
    "contact.name": "Name",
    "contact.email": "Email",
    "contact.subject": "Subject",
    "contact.message": "Message",
    "contact.sendButton": "Send Message",
    "contact.sending": "Sending…",
    "contact.timezone": "Timezone:",
    "contact.successTitle": "Pesan berhasil dikirim!",
    "contact.successSubtitle": "Saya akan membalas secepatnya.",
    "contact.sendAnother": "Kirim pesan lain",
    "contact.externalLinks": "External Links",
    "contact.openLabel": "Open",
    "contact.subjectPlaceholder": "Project inquiry",
    "contact.messagePlaceholder": "Describe your project scope, timeline, and budget.",

    "project.backToPortfolio": "Back to Portfolio",
    "project.source": "Source:",
    "project.techInfo": "Technical Information",
    "project.format": "Format:",
    "project.polycount": "Polycount:",
    "project.texture": "Texture:",
    "project.pipeline": "Pipeline:",
    "project.downloadBlend": "Download Source File (.blend)",
    "project.softwareUsed": "Software Used",
    "project.gallery": "Gallery",
    "project.openDetail": "Open Detail",
    "project.hoverFor3d": "Hover for 3D",
    "project.highlighted": "Highlighted Work",
    "project.interacting": "Interacting...",

    "footer.built": "Frontend MVP portfolio built with Next.js, Tailwind, shadcn/ui.",
    "footer.source": "3D model source:",

    "category.all": "All",
    "category.props": "Props",
    "category.environment": "Environment",
    "category.character": "Character",
    "category.vehicle": "Vehicle",
    "category.other": "Other",

    "loading.optimizing": "Optimizing 3D Model...",

    "viewer.controls": "Orbit drag . Scroll zoom . Right-click pan",
    "viewer.studio": "Studio",
    "viewer.sunset": "Sunset",
    "viewer.wireframe": "Wireframe",
    "viewer.reset": "Reset",
    "viewer.unavailableTitle": "3D viewer tidak dapat ditampilkan.",
    "viewer.unavailableBody":
      "Device/browser saat ini belum mendukung WebGL untuk menampilkan model {title}. Coba browser modern terbaru di desktop.",
  },
  en: {
    "nav.home": "Home",
    "nav.portfolio": "Portfolio",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.viewPortfolio": "View Portfolio",
    "nav.commission": "Commission",
    "nav.navigate": "Navigate",

    "hero.tag": "3D Asset Portfolio",
    "hero.bioSuffix":
      "This portfolio is designed for recruiters and clients to quickly evaluate visual style, technical quality, and pipeline readiness.",
    "hero.viewPortfolio": "View Portfolio",
    "hero.contact": "Contact",
    "hero.downloadCv": "Download CV",

    "snapshot.title": "Quick Snapshot",
    "snapshot.totalAssets": "Total Assets",
    "snapshot.primaryFocus": "Primary Focus",
    "snapshot.availability": "Availability",
    "snapshot.focusValue": "Creature, Environment, Props",
    "snapshot.availabilityValue": "Open for freelance and studio roles",

    "featured.label": "Featured Projects",
    "featured.title": "Highlighted Work",
    "featured.viewAll": "View all assets",

    "portfolio.label": "Portfolio Grid",
    "portfolio.title": "Explore 3D Assets",
    "portfolio.subtitle":
      "Filter by category to find the props, environments, or characters most relevant to your project needs.",
    "portfolio.showing": "showing",
    "portfolio.of": "of",
    "portfolio.total": "total assets",
    "portfolio.empty": "No assets in this category yet.",

    "about.label": "About",
    "about.title": "Artist Profile",
    "about.coreSkills": "Core Skills",
    "about.softwareStack": "Software Stack",

    "contact.label": "Contact",
    "contact.title": "Let's Collaborate",
    "contact.subtitle":
      "Send project details via the form below or reach out directly through the social links.",
    "contact.form": "Contact Form",
    "contact.name": "Name",
    "contact.email": "Email",
    "contact.subject": "Subject",
    "contact.message": "Message",
    "contact.sendButton": "Send Message",
    "contact.sending": "Sending…",
    "contact.timezone": "Timezone:",
    "contact.successTitle": "Message sent successfully!",
    "contact.successSubtitle": "I'll reply as soon as possible.",
    "contact.sendAnother": "Send another message",
    "contact.externalLinks": "External Links",
    "contact.openLabel": "Open",
    "contact.subjectPlaceholder": "Project inquiry",
    "contact.messagePlaceholder": "Describe your project scope, timeline, and budget.",

    "project.backToPortfolio": "Back to Portfolio",
    "project.source": "Source:",
    "project.techInfo": "Technical Information",
    "project.format": "Format:",
    "project.polycount": "Polycount:",
    "project.texture": "Texture:",
    "project.pipeline": "Pipeline:",
    "project.downloadBlend": "Download Source File (.blend)",
    "project.softwareUsed": "Software Used",
    "project.gallery": "Gallery",
    "project.openDetail": "Open Detail",
    "project.hoverFor3d": "Hover for 3D",
    "project.highlighted": "Highlighted Work",
    "project.interacting": "Interacting...",

    "footer.built": "Frontend MVP portfolio built with Next.js, Tailwind, shadcn/ui.",
    "footer.source": "3D model source:",

    "category.all": "All",
    "category.props": "Props",
    "category.environment": "Environment",
    "category.character": "Character",
    "category.vehicle": "Vehicle",
    "category.other": "Other",

    "loading.optimizing": "Optimizing 3D Model...",

    "viewer.controls": "Orbit drag · Scroll zoom · Right-click pan",
    "viewer.studio": "Studio",
    "viewer.sunset": "Sunset",
    "viewer.wireframe": "Wireframe",
    "viewer.reset": "Reset",
    "viewer.unavailableTitle": "3D viewer unavailable.",
    "viewer.unavailableBody":
      "Your device/browser does not support WebGL to display the {title} model. Try a modern desktop browser.",
  },
} as const;

type TranslationKey = keyof (typeof translations)["id"];

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, vars?: Record<string, string>) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "portfolio-locale";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("id");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved === "id" || saved === "en") {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string>): string => {
      let value: string = (translations[locale] as Record<string, string>)[key] ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          value = value.replace(`{${k}}`, v);
        }
      }
      return value;
    },
    [locale],
  );

  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return ctx;
}
