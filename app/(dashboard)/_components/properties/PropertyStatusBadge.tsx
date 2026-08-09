import { Badge } from "@/components/ui/badge";
import { PropertyStatus } from "@/types";

interface PropertyStatusBadgeProps {
  status: PropertyStatus;
  className?: string;
}

export function PropertyStatusBadge({ status, className }: PropertyStatusBadgeProps) {
  switch (status) {
    case PropertyStatus.ACTIVE:
      return (
        <Badge variant="default" className={`bg-success/10 text-success border border-success/20 hover:bg-success/20 ${className}`}>
          Active
        </Badge>
      );
    case PropertyStatus.DRAFT:
      return (
        <Badge variant="outline" className={`bg-warning/10 border-warning/20 text-warning-foreground hover:bg-warning/20 ${className}`}>
          Draft
        </Badge>
      );
    case PropertyStatus.INACTIVE:
      return (
        <Badge variant="secondary" className={`bg-muted border border-muted-foreground/20 text-muted-foreground hover:bg-muted/80 ${className}`}>
          Inactive
        </Badge>
      );
    case PropertyStatus.ARCHIVED:
      return (
        <Badge variant="destructive" className={`bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20 ${className}`}>
          Archived
        </Badge>
      );
    case PropertyStatus.PENDING_VERIFICATION:
      return (
        <Badge variant="outline" className={`bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20 ${className}`}>
          Pending Verification
        </Badge>
      );
    case PropertyStatus.REJECTED:
      return (
        <Badge variant="destructive" className={`bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20 ${className}`}>
          Rejected
        </Badge>
      );
    default:
      return null;
  }
}
