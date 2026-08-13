import React from "react";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { CreditCard, Wallet, Smartphone, ShieldCheck } from "lucide-react";

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
            <div className="flex items-center gap-4 mt-2">
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.476 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* For Tenants */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-foreground text-sm tracking-wider uppercase">For Tenants</h3>
            <ul className="space-y-3">
              <li><Link href="/properties" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Browse Properties</Link></li>
              <li><Link href="/how-it-works" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">How It Works</Link></li>
              <li><Link href="/dashboard/favorites" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Saved Properties</Link></li>
              <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">FAQ</Link></li>
            </ul>
          </div>

          {/* For Landlords */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-foreground text-sm tracking-wider uppercase">For Landlords</h3>
            <ul className="space-y-3">
              <li><Link href="/register/landlord" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">List Your Property</Link></li>
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
          </div>
          
          <Accordion className="w-full">
            <AccordionItem value="tenants" className="border-border/50">
              <AccordionTrigger className="text-base font-semibold hover:no-underline">For Tenants</AccordionTrigger>
              <AccordionContent className="pb-4">
                <ul className="space-y-3 pl-2 pt-1">
                  <li><Link href="/properties" className="block text-sm text-muted-foreground hover:text-primary font-medium">Browse Properties</Link></li>
                  <li><Link href="/how-it-works" className="block text-sm text-muted-foreground hover:text-primary font-medium">How It Works</Link></li>
                  <li><Link href="/dashboard/favorites" className="block text-sm text-muted-foreground hover:text-primary font-medium">Saved Properties</Link></li>
                  <li><Link href="/faq" className="block text-sm text-muted-foreground hover:text-primary font-medium">FAQ</Link></li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="landlords" className="border-border/50">
              <AccordionTrigger className="text-base font-semibold hover:no-underline">For Landlords</AccordionTrigger>
              <AccordionContent className="pb-4">
                <ul className="space-y-3 pl-2 pt-1">
                  <li><Link href="/register/landlord" className="block text-sm text-muted-foreground hover:text-primary font-medium">List Your Property</Link></li>
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

            {/* Payment Trust Badges */}
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity" title="Card Payments">
                <CreditCard className="size-5" />
              </div>
              <div className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity" title="Mobile Banking (bKash/Nagad)">
                <Smartphone className="size-5" />
              </div>
              <div className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity" title="Secure Wallet">
                <Wallet className="size-5" />
              </div>
              <div className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity text-success" title="Secure Checkout">
                <ShieldCheck className="size-5" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
