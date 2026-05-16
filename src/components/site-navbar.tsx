"use client";

import Link from "next/link";
import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useI18n } from "@/lib/i18n";

export function SiteNavbar() {
  const { t, locale, setLocale } = useI18n();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navigationItems = [
    { labelKey: "nav.home" as const, href: "#home" },
    { labelKey: "nav.portfolio" as const, href: "#portfolio" },
    { labelKey: "nav.about" as const, href: "#about" },
    { labelKey: "nav.contact" as const, href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="#home" className="group inline-flex flex-col leading-tight">
          <span className="text-sm font-medium tracking-[0.18em] text-cyan-600 dark:text-cyan-200/80 uppercase">
            Portfolio
          </span>
          <span className="font-heading text-lg font-semibold text-foreground transition-colors group-hover:text-cyan-600 dark:group-hover:text-cyan-200">
            HILMI 3D Lab
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navigationItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
            >
              {t(item.labelKey)}
            </a>
          ))}
          <Link
            href="/commission"
            className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
          >
            {t("nav.commission")}
          </Link>
          <Link
            href="/blog"
            className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
          >
            {t("nav.blog")}
          </Link>
        </nav>

        <div className="hidden md:flex md:items-center md:gap-2">
          {/* Language toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocale(locale === "id" ? "en" : "id")}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground"
            aria-label="Toggle language"
          >
            {locale === "id" ? "EN" : "ID"}
          </Button>

          {/* Theme toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              className="text-muted-foreground hover:text-foreground"
            >
              {theme === "dark" ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
            </Button>
          )}

          <a
            href="#portfolio"
            className={buttonVariants({
              className:
                "border border-cyan-500/50 bg-cyan-500/10 text-cyan-700 dark:border-cyan-200/50 dark:bg-cyan-200/10 dark:text-cyan-100 hover:bg-cyan-500/20",
            })}
          >
            {t("nav.viewPortfolio")}
          </a>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="outline" size="icon" className="border-border bg-muted/30">
                  <Menu className="size-4" />
                  <span className="sr-only">Open navigation</span>
                </Button>
              }
            />
            <SheetContent side="right" className="border-border bg-background text-foreground">
              <SheetHeader>
                <SheetTitle className="text-foreground">{t("nav.navigate")}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-2 px-4">
                {navigationItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
                  >
                    {t(item.labelKey)}
                  </a>
                ))}
                <Link
                  href="/commission"
                  className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
                >
                  {t("nav.commission")}
                </Link>
                <Link
                  href="/blog"
                  className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
                >
                  {t("nav.blog")}
                </Link>
                <div className="mt-3 flex items-center gap-2 px-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLocale(locale === "id" ? "en" : "id")}
                    className="text-xs font-semibold text-muted-foreground hover:text-foreground"
                    aria-label="Toggle language"
                  >
                    {locale === "id" ? "EN" : "ID"}
                  </Button>
                  {mounted && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                      aria-label="Toggle theme"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {theme === "dark" ? (
                        <Sun className="size-4" />
                      ) : (
                        <Moon className="size-4" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
