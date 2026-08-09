import React from "react";
import { SearchX, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function EmptyProperties() {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-4 text-center max-w-lg mx-auto">
      <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
        <Home className="size-10" />
      </div>
      <h2 className="text-2xl font-bold font-heading text-foreground mb-3">
        No properties available yet
      </h2>
      <p className="text-muted-foreground mb-8 leading-relaxed">
        We're currently expanding our listings. Check back soon for new places, or adjust your filters if you're searching for something specific.
      </p>
      <Link href="/properties">
        <Button variant="default" size="lg" className="gap-2">
          <SearchX className="size-4" />
          Clear all filters
        </Button>
      </Link>
    </div>
  );
}
