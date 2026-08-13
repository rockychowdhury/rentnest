"use client";

import React from "react";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HomeFAQ() {
  return (
    <section className="py-20 lg:py-28 bg-background border-t border-border">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Header Area */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground tracking-tight">
              Got questions? <br/> We've got answers.
            </h2>
            <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
              Find out how RentNest makes renting and managing properties easier than ever before.
            </p>
            <div className="pt-2 hidden lg:block">
              <Link href="/faq">
                <Button variant="outline" className="gap-2 rounded-full font-semibold">
                  View all FAQs <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Accordion Area */}
          <div className="lg:col-span-7">
            <Accordion className="w-full space-y-4 border-none">
              <AccordionItem value="item-1" className="rounded-xl px-5 bg-card transition-colors border-none">
                <AccordionTrigger className="text-base sm:text-lg font-semibold hover:no-underline py-5 text-left">
                  Is RentNest really free to use?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5 text-sm sm:text-base">
                  Yes! Tenants can search, filter, and apply for properties completely free of charge. Landlords can list their first 5 properties for free, making it easy to start managing your portfolio online without any upfront costs.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2" className="rounded-xl px-5 bg-card transition-colors border-none">
                <AccordionTrigger className="text-base sm:text-lg font-semibold hover:no-underline py-5 text-left">
                  How do I know the listings are legitimate?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5 text-sm sm:text-base">
                  We verify our landlords to ensure platform safety. Look for the "Verified" badge on listings—this means our team has cross-checked the owner's identity and property details to protect you from scams.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3" className="rounded-xl px-5 bg-card transition-colors border-none">
                <AccordionTrigger className="text-base sm:text-lg font-semibold hover:no-underline py-5 text-left">
                  What is a "Bachelor Mess" category?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5 text-sm sm:text-base">
                  Because shared living is common in Bangladesh, we built specific filters for Bachelor Messes. This allows students and professionals to find shared rooms with clear utility policies, meal rules, and transparent costs upfront.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="pt-8 lg:hidden">
              <Link href="/faq">
                <Button variant="outline" className="w-full gap-2 rounded-full font-semibold">
                  View all FAQs <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
