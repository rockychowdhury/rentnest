import { Skeleton } from "@/components/ui/skeleton";

export default function PropertyHubLoading() {
  return (
    <div className="flex flex-col space-y-8 pb-10" aria-hidden="true">
      <div className="flex items-center gap-4 border-b pb-4">
        <Skeleton className="size-9 rounded-md" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="md:w-48 lg:w-56 shrink-0 flex flex-row md:flex-col gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-9 w-full rounded-md" />
          ))}
        </aside>
        <main className="flex-1 space-y-4">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </main>
      </div>
    </div>
  );
}
