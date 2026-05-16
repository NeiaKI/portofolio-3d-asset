import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check, Clock, MessageCircle, Package, Sparkles, Star, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getCreatorProfile } from "@/lib/projects";
import { SiteNavbar } from "@/components/site-navbar";

export const metadata: Metadata = {
  title: "Commission — HILMI 3D Lab",
  description: "Harga dan paket commission 3D asset untuk game, cinematic, dan visual storytelling.",
};

const PACKAGES = [
  {
    id: "basic",
    icon: Package,
    name: "Basic",
    priceRange: "Rp 500K – 1.5JT",
    tagline: "Props & asset sederhana",
    deliveryDays: "5–10 hari",
    badge: null,
    features: [
      "1 prop / asset sederhana",
      "PBR texturing (2K)",
      "Format .glb / .fbx",
      "1 revisi",
      "Tanpa rigging",
    ],
    examples: ["Weapon / tool", "Furniture", "Small environment prop"],
  },
  {
    id: "standard",
    icon: Zap,
    name: "Standard",
    priceRange: "Rp 1.5JT – 4JT",
    tagline: "Environment & karakter menengah",
    deliveryDays: "10–20 hari",
    badge: "Populer",
    features: [
      "Asset menengah (environment / karakter)",
      "PBR texturing (4K)",
      "Format .glb / .fbx / .blend",
      "3 revisi",
      "Sculpt detail (ZBrush)",
      "Realtime-optimized",
    ],
    examples: ["Environment piece", "Stylized character", "Vehicle"],
  },
  {
    id: "premium",
    icon: Star,
    name: "Premium",
    priceRange: "Hubungi untuk harga",
    tagline: "Proyek besar & creature kompleks",
    deliveryDays: "20–45 hari",
    badge: null,
    features: [
      "Creature / hero asset kompleks",
      "Full production pipeline",
      "PBR texturing (4K–8K)",
      "Revisi tak terbatas",
      "Rigging opsional",
      "Source file (.blend / .ztl)",
      "Priority support",
    ],
    examples: ["Hero creature", "Full environment scene", "Cinematic asset"],
  },
];

const PROCESS_STEPS = [
  { step: "01", title: "Brief", desc: "Kirim deskripsi aset, referensi, dan deadline lewat form kontak." },
  { step: "02", title: "Quote & Agreement", desc: "Saya kirim estimasi harga dan timeline. DP 50% sebelum mulai." },
  { step: "03", title: "Production", desc: "Update progress berkala. Revisi dilakukan di akhir setiap milestone." },
  { step: "04", title: "Delivery", desc: "File final dikirim setelah pelunasan. Format sesuai kebutuhan." },
];

export default async function CommissionPage() {
  const profile = await getCreatorProfile();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_45%_at_18%_0%,rgba(6,182,212,0.12),transparent_72%),radial-gradient(55%_35%_at_84%_7%,rgba(251,191,36,0.10),transparent_70%)]" />
      <SiteNavbar />
      <main className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <Link href="/" className={buttonVariants({ variant: "outline", className: "mb-8 border-border bg-muted/20" })}>
          <ArrowLeft className="size-4" />
          Kembali ke Portfolio
        </Link>
        <section className="mb-12 space-y-4">
          <p className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs tracking-[0.15em] text-cyan-700 dark:border-cyan-200/30 dark:bg-cyan-200/10 dark:text-cyan-100 uppercase">
            <Sparkles className="size-3.5" />
            Commission
          </p>
          <h1 className="font-heading text-4xl font-semibold text-foreground sm:text-5xl">Pesan 3D Asset Custom</h1>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground">
            Semua harga di bawah adalah estimasi. Harga final tergantung kompleksitas, detail, dan deadline. Hubungi saya untuk quote yang lebih akurat.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="size-4 text-cyan-500 dark:text-cyan-200" />
              {profile.location}
            </div>
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <MessageCircle className="size-4 text-cyan-500 dark:text-cyan-200" />
              Respon dalam 1–2 hari kerja
            </div>
          </div>
        </section>
        <section className="mb-16">
          <h2 className="mb-6 font-heading text-2xl font-semibold text-foreground">Paket Layanan</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {PACKAGES.map((pkg) => {
              const Icon = pkg.icon;
              return (
                <Card key={pkg.id} className={`relative border-border bg-card ${pkg.badge ? "border-cyan-500/40 ring-1 ring-cyan-500/20" : ""}`}>
                  {pkg.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-cyan-500/20 text-cyan-700 dark:bg-cyan-200/20 dark:text-cyan-100 border border-cyan-500/30">{pkg.badge}</Badge>
                    </div>
                  )}
                  <CardHeader className="pb-3">
                    <div className="mb-3 inline-flex size-10 items-center justify-center rounded-lg border border-border bg-muted/30">
                      <Icon className="size-5 text-cyan-500 dark:text-cyan-200" />
                    </div>
                    <CardTitle className="text-lg text-foreground">{pkg.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{pkg.tagline}</p>
                    <div className="pt-2">
                      <p className="font-heading text-2xl font-semibold text-foreground">{pkg.priceRange}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground"><Clock className="mr-1 inline size-3" />Estimasi {pkg.deliveryDays}</p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {pkg.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Check className="mt-0.5 size-4 shrink-0 text-cyan-500 dark:text-cyan-200" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Separator className="bg-border" />
                    <div>
                      <p className="mb-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Contoh proyek</p>
                      <div className="flex flex-wrap gap-1.5">
                        {pkg.examples.map((ex) => (
                          <Badge key={ex} variant="outline" className="border-border text-xs text-muted-foreground">{ex}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
        <section className="mb-16">
          <h2 className="mb-6 font-heading text-2xl font-semibold text-foreground">Alur Kerja</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((step, i) => (
              <div key={step.step} className="relative rounded-xl border border-border bg-card p-5">
                {i < PROCESS_STEPS.length - 1 && (
                  <div className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 lg:block">
                    <div className="size-4 rotate-45 border-r border-t border-border bg-background" />
                  </div>
                )}
                <p className="mb-2 font-heading text-3xl font-bold text-cyan-500/30 dark:text-cyan-200/20">{step.step}</p>
                <h3 className="mb-1 font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-8 text-center dark:border-cyan-200/20 dark:bg-cyan-200/5">
          <h2 className="mb-2 font-heading text-2xl font-semibold text-foreground">Siap memulai proyek?</h2>
          <p className="mb-6 text-sm text-muted-foreground">Ceritakan visi kamu. Saya akan bantu wujudkan dalam format 3D production-ready.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {profile.whatsapp && profile.whatsapp !== "YOUR_WHATSAPP_NUMBER" ? (
              <a
                href={`https://wa.me/${profile.whatsapp}?text=${encodeURIComponent("Halo HILMI, saya tertarik dengan commission 3D asset kamu. Boleh minta info lebih lanjut?")}`}
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({ size: "lg", className: "border border-cyan-500/45 bg-cyan-500/15 text-cyan-700 dark:border-cyan-200/45 dark:bg-cyan-200/15 dark:text-cyan-50 hover:bg-cyan-500/25" })}
              >
                <MessageCircle className="size-4" />
                Chat WhatsApp
              </a>
            ) : (
              <a href="/#contact" className={buttonVariants({ size: "lg", className: "border border-cyan-500/45 bg-cyan-500/15 text-cyan-700 dark:border-cyan-200/45 dark:bg-cyan-200/15 dark:text-cyan-50 hover:bg-cyan-500/25" })}>
                <MessageCircle className="size-4" />
                Hubungi Sekarang
              </a>
            )}
            {profile.email && (
              <a
                href={`mailto:${profile.email}?subject=${encodeURIComponent("Commission Inquiry — 3D Asset")}&body=${encodeURIComponent("Halo HILMI,\n\nSaya tertarik dengan layanan commission kamu.\n\nDeskripsi project:\n\nReferensi:\n\nDeadline:\n\nBudget:\n")}`}
                className={buttonVariants({ size: "lg", variant: "outline", className: "border-border bg-muted/20" })}
              >
                <Check className="size-4" />
                Email Langsung
              </a>
            )}
            <Link href="/#portfolio" className={buttonVariants({ size: "lg", variant: "outline", className: "border-border bg-muted/20" })}>
              Lihat Portfolio
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
