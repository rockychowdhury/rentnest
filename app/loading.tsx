import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="w-full flex flex-col bg-background" aria-hidden="true">
      {/* Hero placeholder — mirrors HeroSection height + search bar */}
      <div className="relative w-full min-h-[550px] h-[70vh] flex items-center justify-center bg-muted/40">
        <div className="w-full max-w-5xl mx-auto px-4 flex flex-col items-center">
          <Skeleton className="h-7 w-64 rounded-full mb-6" />
          <Skeleton className="h-12 sm:h-14 w-3/4 mb-4" />
          <Skeleton className="h-5 w-1/2 mb-10" />
          <Skeleton className="h-14 w-full max-w-3xl rounded-full" />
        </div>
      </div>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="flex gap-5 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[200px] w-[280px] shrink-0 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
