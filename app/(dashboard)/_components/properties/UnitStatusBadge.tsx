import { Badge } from "@/components/ui/badge";
import { UnitStatus } from "@/types";

interface UnitStatusBadgeProps {
  status: UnitStatus;
  className?: string;
}

export function UnitStatusBadge({ status, className }: UnitStatusBadgeProps) {
  switch (status) {
    case UnitStatus.AVAILABLE:
      return (
        <Badge variant="default" className={`bg-success hover:bg-success/90 text-white ${className}`}>
          Available
        </Badge>
      );
    case UnitStatus.OCCUPIED:
      return (
        <Badge variant="secondary" className={`bg-muted text-muted-foreground hover:bg-muted/90 ${className}`}>
          Occupied
        </Badge>
      );
    case UnitStatus.MAINTENANCE:
      return (
        <Badge variant="outline" className={`border-warning text-warning ${className}`}>
          Maintenance
        </Badge>
      );
    default:
      return null;
  }
}
