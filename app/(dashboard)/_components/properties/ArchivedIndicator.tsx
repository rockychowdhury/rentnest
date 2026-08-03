import { Badge } from "@/components/ui/badge";
import { Archive } from "lucide-react";

interface ArchivedIndicatorProps {
  className?: string;
}

export function ArchivedIndicator({ className }: ArchivedIndicatorProps) {
  return (
    <Badge variant="secondary" className={`bg-destructive/10 text-destructive hover:bg-destructive/20 flex items-center gap-1 ${className}`}>
      <Archive className="h-3 w-3" />
      Archived
    </Badge>
  );
}
