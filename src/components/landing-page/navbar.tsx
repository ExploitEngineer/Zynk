"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "../mode-toggle";
import { Button } from "@/components/ui/button";

interface MenuItems {
  name: string;
  href: string;
}

const menuItems: MenuItems[] = [
  { name: "Features", href: "#features" },
  { name: "Content", href: "#content" },
  { name: "Stats", href: "#stats" },
  { name: "Testimonials", href: "#testimonials" },
  { name: "Pricing", href: "#pricing" },
  { name: "FAQs", href: "#faqs" },
];

const authMenuItems: MenuItems[] = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/features" },
  { name: "Content", href: "/content" },
  { name: "Stats", href: "/stats" },
  { name: "Pricing", href: "/pricing" },
  { name: "FAQs", href: "/faqs" },
];

type AuthPages = "signup" | "login" | "forgot-password" | undefined;

export const Navbar = () => {
  const pathname: string = usePathname() || "/";
  const route: string = pathname.split("/")[1] || "";

  const authRoutes: AuthPages[] = ["signup", "login", "forgot-password"];
  const authNav = authRoutes.includes(route as AuthPages);

  const [menuState, setMenuState] = React.useState(false);

  // helper to close mobile menu after click
  const handleMobileLinkClick = () => setMenuState(false);

  return (
    <header>
      <nav className="bg-background/70 fixed top-0 right-0 left-0 z-20 border-b backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6">
          <div
            className={cn(
              "flex items-center gap-4 py-3 lg:py-4",
              authNav ? "justify-start" : "justify-between",
            )}
          >
            {/* Left */}
            <div className="flex items-center gap-4">
              {/* Mobile Toggle */}
              <Button
                onClick={() => setMenuState((s) => !s)}
                variant="ghost"
                size="icon"
                className="relative z-20 cursor-pointer p-2 lg:hidden"
                aria-expanded={menuState}
                aria-label={menuState ? "Close menu" : "Open menu"}
              >
                {!menuState ? <Menu size={20} /> : <X size={20} />}
              </Button>

              {/* Desktop Links */}
              <div className="hidden lg:block">
                <ul className="flex gap-8 text-sm font-medium">
                  {(authNav ? authMenuItems : menuItems).map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right */}
            {!authNav && (
              <div className="hidden items-center gap-4 lg:flex">
                {/* ModeToggle wrapped so we can align it perfectly */}
                <div className="flex items-center">
                  <ModeToggle />
                </div>

                <div className="flex items-center gap-3">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile dropdown (collapsible) */}
          <div
            className={cn(
              "overflow-hidden transition-[max-height,opacity] duration-300 lg:hidden",
              menuState ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0",
            )}
            aria-hidden={!menuState}
          >
            <div className="px-4 pb-6">
              <ul className="space-y-4">
                {(authNav ? authMenuItems : menuItems).map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={handleMobileLinkClick}
                      className="text-muted-foreground hover:text-foreground block text-base transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}

                {/* Mobile row: Mode toggle + auth actions */}
                {!authNav && (
                  <li>
                    <div className="mt-2 flex items-center justify-between gap-4">
                      <div>
                        <ModeToggle />
                      </div>
                      <div className="flex gap-3">
                        <Button asChild variant="outline" size="sm">
                          <Link href="/login">Login</Link>
                        </Button>
                        <Button asChild size="sm">
                          <Link href="/signup">Sign Up</Link>
                        </Button>
                      </div>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
