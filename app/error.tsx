"use client";

import { useEffect } from "react";
import Link from "next/link";

import { RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-background flex items-center justify-center relative">
      <div className="relative z-10 flex flex-col items-center text-center px-4 py-20 max-w-xl mx-auto w-full">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border mb-6">
          Error 500
        </span>
        <h1 className="font-heading text-7xl sm:text-8xl font-bold tracking-tight text-foreground leading-none">
          500
        </h1>
        <h2 className="mt-4 font-heading text-2xl sm:text-3xl font-bold text-foreground">
          Something went wrong
        </h2>
        <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md">
          We ran into an unexpected issue. Please try again, or return home to continue browsing.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-xs transition-all hover:bg-primary-hover active:translate-y-px"
          >
            Try again
            <RotateCcw className="size-4" />
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-muted active:translate-y-px"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}