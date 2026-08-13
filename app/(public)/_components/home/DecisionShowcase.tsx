import React from "react";
import { MessageSquareText, FileText, CheckCircle, PhoneCall } from "lucide-react";

export function DecisionShowcase() {
  const features = [
    {
      icon: MessageSquareText,
      title: "Previous Tenant Reviews",
      description: "Read authentic feedback from past renters to know exactly what to expect before you sign the lease."
    },
    {
      icon: FileText,
      title: "Comprehensive Property Details",
      description: "Get the full picture with high-quality photos, detailed descriptions, and clear property policies."
    },
    {
      icon: CheckCircle,
      title: "Unit-Level Amenities & Pricing",
      description: "Know exactly what's included in each unit and review transparent pricing with no hidden fees."
    },
    {
      icon: PhoneCall,
      title: "Direct Landlord Contact",
      description: "Reach out to landlords effortlessly to schedule a visit, negotiate terms, or ask specific questions."
    }
  ];

  return (
    <section className="py-24 bg-card overflow-hidden border-y border-border">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-heading text-foreground tracking-tight mb-6 leading-tight">
            Make your move-in decision <span className="text-primary">with confidence</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl">
            We provide all the insights you need—from real tenant reviews to unit-level specifics—so you can find the perfect home without the guesswork.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="bg-background border border-border rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="size-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 font-heading">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
