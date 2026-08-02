import Link from "next/link";
import { Building2 } from "lucide-react";

interface LogoProps {
  className?: string;
  isDark?: boolean;
}

export function Logo({ className, isDark }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 group ${className || ""}`}>
      <div className="size-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
        <Building2 className="size-5" />
      </div>
      <span className={`font-heading text-xl font-bold tracking-tight ${isDark ? "text-white" : "text-foreground"}`}>
        Rent<span className="text-primary">Nest</span>
      </span>
    </Link>
  );
}

export default Logo;
