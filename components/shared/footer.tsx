"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Building2, Globe, Heart } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [lang, setLang] = useState<"EN" | "BN">("EN");

  const footerGroups = [
    {
      title: "For Tenants",
      links: [
        { label: "Browse Properties", href: "/properties" },
        { label: "How It Works", href: "/how-it-works" },
        { label: "Saved Properties", href: "/tenant" },
        { label: "FAQ", href: "/faq" },
      ],
    },
    {
      title: "For Landlords",
      links: [
        { label: "List Your Property", href: "/register" },
        { label: "Landlord Overview", href: "/for-landlords" },
        { label: "Landlord FAQ", href: "/faq" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Contact Us", href: "/contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Terms of Service", href: "/terms" },
        { label: "Privacy Policy", href: "/privacy" },
      ],
    },
  ];

  return (
    <footer className="w-full bg-card border-t border-border mt-auto font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        {/* Desktop 5-Column Grid */}
        <div className="hidden md:grid md:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-1 space-y-4">
            <Logo />
            <p className="text-xs text-muted-foreground leading-relaxed">
              The smart, transparent way to discover and manage rental properties across Bangladesh.
            </p>
          </div>

          {/* Dynamic Link Groups */}
          {footerGroups.map((group) => (
            <div key={group.title} className="space-y-3">
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                {group.title}
              </h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Mobile Accordion View */}
        <div className="md:hidden space-y-6 mb-8">
          <div className="space-y-3">
            <Logo />
            <p className="text-xs text-muted-foreground leading-relaxed">
              The smart, transparent way to discover and manage rental properties across Bangladesh.
            </p>
          </div>

          <Accordion className="w-full">
            {footerGroups.map((group, index) => (
              <AccordionItem key={group.title} value={`item-${index}`}>
                <AccordionTrigger className="text-xs font-semibold uppercase tracking-wider text-foreground hover:no-underline">
                  {group.title}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 pt-1 pb-2">
                    {group.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-xs text-muted-foreground hover:text-primary transition-colors block py-1"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <Separator className="my-6" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 text-center md:text-left">
            <span>© {currentYear} RentNest. All rights reserved. Made with</span>
            <Heart className="size-3 text-primary fill-primary inline" />
            <span>in Bangladesh.</span>
          </div>

          {/* Payment Method Badges & Language Toggle */}
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <div className="flex items-center gap-1.5 text-[11px] font-medium">
              <span className="px-2 py-0.5 rounded bg-muted/80 border border-border text-foreground font-semibold">bKash</span>
              <span className="px-2 py-0.5 rounded bg-muted/80 border border-border text-foreground font-semibold">Nagad</span>
              <span className="px-2 py-0.5 rounded bg-muted/80 border border-border text-foreground font-semibold">Rocket</span>
              <span className="px-2 py-0.5 rounded bg-muted/80 border border-border text-foreground">Cards</span>
            </div>

            <button
              onClick={() => setLang(lang === "EN" ? "BN" : "EN")}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted text-foreground hover:bg-muted/80 border border-border transition-colors text-xs font-medium"
            >
              <Globe className="size-3 text-primary" />
              {lang}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
