import React from "react";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Frequently Asked Questions | RentNest",
  description: "Find answers to common questions about using RentNest for tenants and landlords.",
};

export default function FAQPage() {
  return (
    <div className="w-full flex flex-col bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 bg-primary/5 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold font-heading text-foreground tracking-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about RentNest. Can't find the answer you're looking for? Feel free to <Link href="/contact" className="text-primary hover:underline">contact our team</Link>.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* General Questions */}
          <div>
            <h2 className="text-2xl font-bold font-heading mb-6 flex items-center gap-2">
              <span className="bg-primary/10 text-primary size-8 rounded-full flex items-center justify-center text-sm">1</span> 
              General
            </h2>
            <Accordion className="w-full space-y-4">
              <AccordionItem value="g1" className="border border-border rounded-lg px-4 bg-card">
                <AccordionTrigger className="text-base font-semibold hover:no-underline py-4 text-left">
                  What is RentNest?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                  RentNest is a comprehensive property rental platform built specifically for the Bangladeshi market. We connect tenants looking for family apartments, bachelor messes, or commercial spaces with verified landlords.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="g2" className="border border-border rounded-lg px-4 bg-card">
                <AccordionTrigger className="text-base font-semibold hover:no-underline py-4 text-left">
                  Is RentNest free to use?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                  For tenants, browsing properties and contacting landlords is 100% free. For landlords, listing your first 5 properties is completely free. We charge a nominal service fee for premium features and larger portfolios.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="g3" className="border border-border rounded-lg px-4 bg-card">
                <AccordionTrigger className="text-base font-semibold hover:no-underline py-4 text-left">
                  Are the listings verified?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                  We have a strict verification process for landlords. Listings with a "Verified" badge indicate that our team has confirmed the landlord's identity and ownership/management rights to the property.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* For Tenants */}
          <div>
            <h2 className="text-2xl font-bold font-heading mb-6 flex items-center gap-2">
              <span className="bg-primary/10 text-primary size-8 rounded-full flex items-center justify-center text-sm">2</span> 
              For Tenants
            </h2>
            <Accordion className="w-full space-y-4">
              <AccordionItem value="t1" className="border border-border rounded-lg px-4 bg-card">
                <AccordionTrigger className="text-base font-semibold hover:no-underline py-4 text-left">
                  How do I apply for a property?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                  Once you find a property you like, click the "Apply Now" or "Contact Landlord" button on the listing page. You'll need to create a free account to securely message the landlord and submit your application details.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="t2" className="border border-border rounded-lg px-4 bg-card">
                <AccordionTrigger className="text-base font-semibold hover:no-underline py-4 text-left">
                  Can I search for specific utility amenities like generator backup?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                  Yes! Our advanced filters allow you to search specifically for properties that include generator backup, WASA water connection, pre-paid gas, elevator access, and more.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="t3" className="border border-border rounded-lg px-4 bg-card">
                <AccordionTrigger className="text-base font-semibold hover:no-underline py-4 text-left">
                  What is a "Bachelor Mess" on RentNest?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                  A Bachelor Mess is a shared living arrangement common in Bangladesh. RentNest has specific categories and filters designed to help students and single professionals find suitable shared rooms or flat-shares with clear rules and utility splitting policies.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* For Landlords */}
          <div id="landlord">
            <h2 className="text-2xl font-bold font-heading mb-6 flex items-center gap-2">
              <span className="bg-primary/10 text-primary size-8 rounded-full flex items-center justify-center text-sm">3</span> 
              For Landlords
            </h2>
            <Accordion className="w-full space-y-4">
              <AccordionItem value="l1" className="border border-border rounded-lg px-4 bg-card">
                <AccordionTrigger className="text-base font-semibold hover:no-underline py-4 text-left">
                  How do I list my property?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                  Click on "List Your Property" in the navigation bar to create a Landlord account. Once verified, you can access your Landlord Dashboard to add properties, upload photos, and set your pricing and utility policies.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="l2" className="border border-border rounded-lg px-4 bg-card">
                <AccordionTrigger className="text-base font-semibold hover:no-underline py-4 text-left">
                  How do I screen tenants?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                  When a tenant applies, you will receive a notification in your Application Queue. You can view their verified profile, contact them directly through our secure messaging system, and approve or decline the application with one click.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="l3" className="border border-border rounded-lg px-4 bg-card">
                <AccordionTrigger className="text-base font-semibold hover:no-underline py-4 text-left">
                  Can I track my expiring leases?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                  Absolutely. The Landlord Dashboard features an Occupancy Tracker that gives you a bird's-eye view of your entire portfolio, highlighting which leases are expiring in the next 30, 60, or 90 days.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

        </div>
        
        <div className="max-w-3xl mx-auto px-4 mt-20 text-center">
          <div className="bg-muted/30 p-8 rounded-2xl border border-border">
            <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
            <p className="text-muted-foreground mb-6">Our support team is here to help you every step of the way.</p>
            <Link href="/contact">
              <Button>Contact Support</Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
