import React from "react";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils/shadcnUtils";

const testimonials = [
  {
    id: 1,
    quote: "[Placeholder testimonial — replace with real tenant quote about finding a family apartment easily]",
    name: "John Doe",
    role: "Tenant",
    location: "Dhaka",
    heightClass: "md:h-[220px]"
  },
  {
    id: 2,
    quote: "[Placeholder testimonial — replace with real landlord quote discussing the ease of managing multiple leases and verifying tenants without hassle]",
    name: "Jane Smith",
    role: "Landlord",
    location: "Chattogram",
    heightClass: "md:h-[280px]"
  },
  {
    id: 3,
    quote: "[Placeholder testimonial — replace with real tenant quote]",
    name: "Ahmed R.",
    role: "Tenant",
    location: "Sylhet",
    heightClass: "md:h-[190px]"
  },
  {
    id: 4,
    quote: "[Placeholder testimonial — replace with real landlord quote on how quick rent collection has become using the platform]",
    name: "Fatema B.",
    role: "Landlord",
    location: "Dhaka",
    heightClass: "md:h-[240px]"
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-background overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground tracking-tight mb-4">
            What Tenants & Landlords Say
          </h2>
          <p className="text-muted-foreground text-lg">
            Real stories from the RentNest community.
          </p>
        </div>

        {/* Masonry-like grid using flex columns or CSS columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className={cn(
                "bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col relative",
                testimonial.heightClass
              )}
            >
              <div className="flex gap-1 mb-4 text-amber-400">
                <Star className="size-4 fill-current" />
                <Star className="size-4 fill-current" />
                <Star className="size-4 fill-current" />
                <Star className="size-4 fill-current" />
                <Star className="size-4 fill-current" />
              </div>
              
              <blockquote className="text-foreground text-sm font-medium leading-relaxed mb-6 italic flex-1">
                &quot;{testimonial.quote}&quot;
              </blockquote>
              
              <div className="flex items-center gap-3 mt-auto">
                <div className="size-10 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground shrink-0 border border-border">
                  {testimonial.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-foreground truncate">{testimonial.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Badge variant="outline" className={cn(
                      "text-[10px] px-1.5 py-0 rounded font-semibold border-none bg-opacity-20",
                      testimonial.role === "Tenant" ? "bg-primary text-primary" : "bg-secondary text-secondary-foreground"
                    )}>
                      {testimonial.role}
                    </Badge>
                    <span className="text-xs text-muted-foreground truncate">&bull; {testimonial.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
