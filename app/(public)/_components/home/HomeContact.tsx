import React from "react";
import Link from "next/link";
import { Mail, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HomeContact() {
  return (
    <section className="py-12 bg-muted/30 border-t border-border">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-8 md:py-12">
          
          <div className="max-w-xl text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-foreground mb-3">
              Need personalized help?
            </h2>
            <p className="text-muted-foreground text-lg">
              Our support team is standing by to help you find your dream home or get your properties listed.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <Link href="/contact">
              <Button size="lg" className="rounded-full shadow-sm gap-2">
                <Mail className="size-4" /> Contact Support
              </Button>
            </Link>
            <a href="tel:+8801234567890">
              <Button size="lg" variant="secondary" className="rounded-full gap-2">
                <PhoneCall className="size-4" /> Call Us
              </Button>
            </a>
          </div>
          
        </div>
      </div>
    </section>
  );
}
