"use client";

import { Cpu, MapPin, Wrench } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/lib/i18n";
import type { CreatorProfile } from "@/lib/portfolio-shared";

type AboutSectionProps = {
  profile: CreatorProfile;
};

export function AboutSection({ profile }: AboutSectionProps) {
  const { t } = useI18n();

  return (
    <section id="about" className="scroll-mt-24 space-y-6">
      <div>
        <p className="text-xs font-medium tracking-[0.18em] text-cyan-600 dark:text-cyan-200/80 uppercase">
          {t("about.label")}
        </p>
        <h2 className="font-heading text-3xl font-semibold text-foreground sm:text-4xl">
          {t("about.title")}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{profile.bioLong}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="font-heading text-xl text-card-foreground">{profile.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{profile.roleTitle}</p>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/30 px-3 py-1.5">
              <MapPin className="size-4 text-cyan-500 dark:text-cyan-200" />
              {profile.location}
            </div>
            <Separator className="bg-border" />
            <p className="leading-6">{profile.bioShort}</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2 text-card-foreground">
              <Cpu className="size-4 text-cyan-500 dark:text-cyan-200" />
              {t("about.coreSkills")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <Badge key={skill} className="bg-muted/40 text-foreground hover:bg-muted/60">
                  {skill}
                </Badge>
              ))}
            </div>
            <div>
              <p className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-foreground">
                <Wrench className="size-4 text-cyan-500 dark:text-cyan-200" />
                {t("about.softwareStack")}
              </p>
              <div className="flex flex-wrap gap-2">
                {profile.softwareList.map((software) => (
                  <Badge
                    key={software}
                    variant="outline"
                    className="border-border text-muted-foreground"
                  >
                    {software}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
