import Link from "next/link";
import { ArrowRight, House } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center relative">
      <div className="relative z-10 flex flex-col items-center text-center px-4 py-20 max-w-xl mx-auto w-full">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border mb-6">
          <House className="size-3.5" />
          Error 404
        </span>
        <h1 className="font-heading text-7xl sm:text-8xl font-bold tracking-tight text-foreground leading-none">
          404
        </h1>
        <h2 className="mt-4 font-heading text-2xl sm:text-3xl font-bold text-foreground">
          Page not found
        </h2>
        <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md">
          The page you are looking for may have moved, or the link is no longer valid.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/">
            <Button className="gap-1.5">
              Back to home
              <ArrowRight className="size-4" />
            </Button>
          </Link>
          <Link href="/properties">
            <Button variant="secondary" className="gap-1.5">
              Browse properties
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
