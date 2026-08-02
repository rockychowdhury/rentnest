"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Pagination as ShadcnPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

interface CustomPaginationProps {
  meta: PaginationMeta;
  onPageChange?: (page: number) => void;
}

export function CustomPagination({ meta, onPageChange }: CustomPaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const totalPages = Math.ceil(meta.total / meta.limit);

  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    
    if (onPageChange) {
      onPageChange(page);
    } else {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", page.toString());
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }
  };

  const visiblePages: (number | "ellipsis")[] = [];
  
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      visiblePages.push(i);
    }
  } else {
    if (meta.page <= 3) {
      visiblePages.push(1, 2, 3, 4, "ellipsis", totalPages);
    } else if (meta.page >= totalPages - 2) {
      visiblePages.push(1, "ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      visiblePages.push(1, "ellipsis", meta.page - 1, meta.page, meta.page + 1, "ellipsis", totalPages);
    }
  }

  const startItem = (meta.page - 1) * meta.limit + 1;
  const endItem = Math.min(meta.page * meta.limit, meta.total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 w-full">
      <div className="text-sm text-muted-foreground text-center sm:text-left">
        Showing <span className="font-semibold text-foreground">{startItem}</span> to{" "}
        <span className="font-semibold text-foreground">{endItem}</span> of{" "}
        <span className="font-semibold text-foreground">{meta.total}</span> results
      </div>

      <ShadcnPagination className="justify-center sm:justify-end mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(meta.page - 1);
              }}
              className={meta.page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer transition-colors"}
              aria-disabled={meta.page <= 1}
            />
          </PaginationItem>

          {visiblePages.map((p, i) => (
            <PaginationItem key={i}>
              {p === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink 
                  isActive={p === meta.page}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(p as number);
                  }}
                  className="cursor-pointer transition-colors"
                >
                  {p}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext 
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(meta.page + 1);
              }}
              className={meta.page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer transition-colors"}
              aria-disabled={meta.page >= totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </ShadcnPagination>
    </div>
  );
}

export default CustomPagination;
