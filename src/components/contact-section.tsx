"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Mail, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/lib/i18n";
import { type SocialLink } from "@/lib/portfolio-shared";

type FormState = "idle" | "submitting" | "success" | "error";

type ContactSectionProps = {
  email: string;
  location: string;
  socialLinks: readonly SocialLink[] | SocialLink[];
};

export function ContactSection({ email, location, socialLinks }: ContactSectionProps) {
  const { t } = useI18n();
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      subject: (form.elements.namedItem("subject") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setState("success");
        form.reset();
        toast.success(t("contact.successTitle"), {
          description: t("contact.successSubtitle"),
        });
      } else {
        const json = await res.json().catch(() => ({}));
        const msg =
          json.error ?? "Pesan gagal dikirim. Silakan coba lagi atau hubungi lewat link sosial.";
        setErrorMsg(msg);
        setState("error");
        toast.error("Gagal mengirim pesan", { description: msg });
      }
    } catch {
      const msg = "Terjadi kesalahan jaringan. Silakan coba lagi.";
      setErrorMsg(msg);
      setState("error");
      toast.error("Kesalahan jaringan", { description: msg });
    }
  }

  return (
    <section id="contact" className="scroll-mt-24 space-y-6">
      <div>
        <p className="text-xs font-medium tracking-[0.18em] text-cyan-600 dark:text-cyan-200/80 uppercase">
          {t("contact.label")}
        </p>
        <h2 className="font-heading text-3xl font-semibold text-foreground sm:text-4xl">
          {t("contact.title")}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          {t("contact.subtitle")}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2 text-card-foreground">
              <Send className="size-4 text-cyan-500 dark:text-cyan-200" />
              {t("contact.form")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {state === "success" ? (
              <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-4 py-6 text-center">
                <p className="text-sm font-medium text-cyan-700 dark:text-cyan-100">
                  {t("contact.successTitle")}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{t("contact.successSubtitle")}</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mt-4 text-muted-foreground hover:text-foreground"
                  onClick={() => setState("idle")}
                >
                  {t("contact.sendAnother")}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground">
                      {t("contact.name")}
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      placeholder="Your name"
                      className="border-border bg-muted/20 text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">
                      {t("contact.email")}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      required
                      placeholder="you@email.com"
                      className="border-border bg-muted/20 text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-foreground">
                    {t("contact.subject")}
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    required
                    placeholder={t("contact.subjectPlaceholder")}
                    className="border-border bg-muted/20 text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-foreground">
                    {t("contact.message")}
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    placeholder={t("contact.messagePlaceholder")}
                    className="border-border bg-muted/20 text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                {state === "error" && (
                  <p className="text-xs text-red-500">{errorMsg}</p>
                )}

                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground">
                    {t("contact.timezone")} {location}
                  </p>
                  <Button
                    type="submit"
                    disabled={state === "submitting"}
                    className="border border-cyan-500/45 bg-cyan-500/10 text-cyan-700 dark:border-cyan-200/45 dark:bg-cyan-200/10 dark:text-cyan-50 hover:bg-cyan-500/20 disabled:opacity-50"
                  >
                    {state === "submitting" ? t("contact.sending") : t("contact.sendButton")}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2 text-card-foreground">
              <Mail className="size-4 text-cyan-500 dark:text-cyan-200" />
              {t("contact.externalLinks")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-foreground transition-colors hover:border-cyan-500/30 hover:bg-cyan-500/[0.06]"
              >
                <span>{link.label}</span>
                <span className="text-muted-foreground">{t("contact.openLabel")}</span>
              </a>
            ))}
            {email && (
              <a
                href={`mailto:${email}`}
                className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-foreground transition-colors hover:bg-muted/40"
              >
                {email}
              </a>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
