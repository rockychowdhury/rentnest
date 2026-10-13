import React from "react";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Globe } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        
        {/* Desktop Layout */}
        <div className="hidden md:grid grid-cols-4 gap-8 xl:gap-12 pb-12 border-b border-border/50">
          
          {/* Brand Column */}
          <div className="flex flex-col gap-4 col-span-1">
            <Logo />
            <p className="text-sm text-muted-foreground mt-2 max-w-xs leading-relaxed">
              Rent with confidence, list with ease. The smartest way to find or manage rentals in Bangladesh.
            </p>
            <div className="flex flex-col gap-1 mt-1 text-sm text-muted-foreground">
              <a href="mailto:contact@rentnest.com" className="hover:text-primary transition-colors">contact@rentnest.com</a>
              <a href="tel:+8801234567890" className="hover:text-primary transition-colors">+880 123 456 7890</a>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <a href="https://github.com/rockychowdhury" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="GitHub">
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://linkedin.com/in/rockychowdhury1" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="LinkedIn">
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="https://rockychowdhury.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="Portfolio">
                <Globe className="size-5" />
              </a>
            </div>
          </div>

          {/* For Tenants */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-foreground text-sm tracking-wider uppercase">For Tenants</h3>
            <ul className="space-y-3">
              <li><Link href="/properties" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Browse Properties</Link></li>
              <li><Link href="/how-it-works" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">How It Works</Link></li>
              <li><Link href="/tenant-dashboard/saved-properties" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Saved Properties</Link></li>
              <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">FAQ</Link></li>
            </ul>
          </div>

          {/* For Landlords */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-foreground text-sm tracking-wider uppercase">For Landlords</h3>
            <ul className="space-y-3">
              <li><Link href="/register?role=LANDLORD" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">List Your Property</Link></li>
              <li><Link href="/for-landlords" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Overview</Link></li>
              <li><Link href="/faq#landlord" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Landlord FAQ</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-foreground text-sm tracking-wider uppercase">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Contact</Link></li>
              <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Privacy Policy</Link></li>
            </ul>
          </div>

        </div>

        {/* Mobile Layout (Accordion) */}
        <div className="md:hidden pb-8 border-b border-border/50">
          <div className="mb-8">
            <Logo />
            <p className="text-sm text-muted-foreground mt-3 max-w-xs leading-relaxed">
              Rent with confidence, list with ease. The smartest way to find or manage rentals in Bangladesh.
            </p>
            <div className="flex flex-col gap-1 mt-3 text-sm text-muted-foreground">
              <a href="mailto:contact@rentnest.com" className="hover:text-primary transition-colors">contact@rentnest.com</a>
              <a href="tel:+8801234567890" className="hover:text-primary transition-colors">+880 123 456 7890</a>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <a href="https://github.com/rockychowdhury" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="GitHub">
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://linkedin.com/in/rockychowdhury1" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="LinkedIn">
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="https://rockychowdhury.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="Portfolio">
                <Globe className="size-5" />
              </a>
            </div>
          </div>
          
          <Accordion className="w-full">
            <AccordionItem value="tenants" className="border-border/50">
              <AccordionTrigger className="text-base font-semibold hover:no-underline">For Tenants</AccordionTrigger>
              <AccordionContent className="pb-4">
                <ul className="space-y-3 pl-2 pt-1">
                  <li><Link href="/properties" className="block text-sm text-muted-foreground hover:text-primary font-medium">Browse Properties</Link></li>
                  <li><Link href="/how-it-works" className="block text-sm text-muted-foreground hover:text-primary font-medium">How It Works</Link></li>
                  <li><Link href="/tenant-dashboard/saved-properties" className="block text-sm text-muted-foreground hover:text-primary font-medium">Saved Properties</Link></li>
                  <li><Link href="/faq" className="block text-sm text-muted-foreground hover:text-primary font-medium">FAQ</Link></li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="landlords" className="border-border/50">
              <AccordionTrigger className="text-base font-semibold hover:no-underline">For Landlords</AccordionTrigger>
              <AccordionContent className="pb-4">
                <ul className="space-y-3 pl-2 pt-1">
                  <li><Link href="/register?role=LANDLORD" className="block text-sm text-muted-foreground hover:text-primary font-medium">List Your Property</Link></li>
                  <li><Link href="/for-landlords" className="block text-sm text-muted-foreground hover:text-primary font-medium">Overview</Link></li>
                  <li><Link href="/faq#landlord" className="block text-sm text-muted-foreground hover:text-primary font-medium">Landlord FAQ</Link></li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="company" className="border-border/50">
              <AccordionTrigger className="text-base font-semibold hover:no-underline">Company</AccordionTrigger>
              <AccordionContent className="pb-4">
                <ul className="space-y-3 pl-2 pt-1">
                  <li><Link href="/about" className="block text-sm text-muted-foreground hover:text-primary font-medium">About Us</Link></li>
                  <li><Link href="/contact" className="block text-sm text-muted-foreground hover:text-primary font-medium">Contact</Link></li>
                  <li><Link href="/terms" className="block text-sm text-muted-foreground hover:text-primary font-medium">Terms of Service</Link></li>
                  <li><Link href="/privacy" className="block text-sm text-muted-foreground hover:text-primary font-medium">Privacy Policy</Link></li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col-reverse md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-muted-foreground font-medium">
            &copy; {currentYear} RentNest. All rights reserved.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-8">
            {/* Theme Toggle in Footer */}
            <div className="flex items-center gap-3 bg-muted/30 px-3 py-1.5 rounded-full border border-border/50">
              <span className="text-xs font-medium text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>

          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
