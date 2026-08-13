import React from "react";
import { SearchX, RotateCcw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function EmptyProperties() {
  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4">
      <div className="size-16 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
        <SearchX className="size-8" />
      </div>
      <div className="space-y-1 max-w-md mx-auto">
        <h2 className="text-xl font-heading font-bold text-foreground">
          No matching properties found
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          We couldn't find any listings matching your active search criteria. Try clearing or relaxing some filters.
        </p>
      </div>
      <div>
        <Link href="/properties">
          <Button variant="default" size="sm" className="gap-1.5 text-xs">
            <SearchX className="size-3.5" />
            Clear all filters
          </Button>
        </Link>
      </div>
    </div>
  );
}
