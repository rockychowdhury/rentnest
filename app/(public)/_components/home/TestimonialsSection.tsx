import React from "react";
import { Quote, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Finding a bachelor mess in Dhanmondi was always frustrating. RentNest showed clear WASA water source and generator backup details before I even visited!",
      name: "Tanvir Hossain",
      role: "TENANT",
      location: "Dhanmondi, Dhaka",
      initials: "TH",
      rating: 5,
    },
    {
      quote: "Managing 6 units in Uttara used to mean messy notebook tracking. Now rent collection and lease expiry dates are completely automated.",
      name: "Sharmin Sultana",
      role: "LANDLORD",
      location: "Uttara, Dhaka",
      initials: "SS",
      rating: 5,
    },
    {
      quote: "Quick online rental application saved so much time. I get clear lease agreements and instant confirmation for rent payments.",
      name: "Rahat Chowdhury",
      role: "TENANT",
      location: "GEC, Chattogram",
      initials: "RC",
      rating: 5,
    },
    {
      quote: "Verified tenant profiles give me total peace of mind before handing over apartment keys to new families.",
      name: "Anisur Rahman",
      role: "LANDLORD",
      location: "Zindabazar, Sylhet",
      initials: "AR",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-background border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            Community Feedback
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
            What Tenants & Landlords Say
          </h2>
          <p className="text-xs text-muted-foreground">
            Real experiences from people searching and renting across Bangladesh.
          </p>
        </div>

        {/* Staggered Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {testimonials.map((item, idx) => {
            const isOffset = idx % 2 !== 0;

            return (
              <div
                key={item.name}
                className={`bg-card rounded-3xl border border-border/80 p-6 space-y-4 shadow-xs transition-all hover:border-primary/40 hover:shadow-md ${
                  isOffset ? "lg:translate-y-4" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <Quote className="size-6 text-primary/40" />
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="size-3.5 text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-foreground/90 leading-relaxed italic">
                  "{item.quote}"
                </p>

                <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Avatar className="size-8 border border-border">
                      <AvatarFallback className="text-[11px] font-semibold bg-primary/10 text-primary">
                        {item.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-xs font-semibold text-foreground">
                        {item.name}
                      </h4>
                      <span className="text-[10px] text-muted-foreground">
                        {item.location}
                      </span>
                    </div>
                  </div>

                  <Badge
                    variant={item.role === "LANDLORD" ? "default" : "secondary"}
                    className="text-[9px] px-2 py-0.5"
                  >
                    {item.role}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
