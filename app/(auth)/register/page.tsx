import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RegisterForm } from "@/components/forms/RegisterForm";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export default function RegisterPage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 font-sans overflow-hidden bg-background">
      
      {/* Back Button */}
      <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-50">
        <Link href="/">
          <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-secondary/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[30vw] h-[30vw] bg-accent/40 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[10%] w-[35vw] h-[35vw] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 bg-card/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row max-w-4xl w-full min-h-[550px] border border-border/50">
        
        {/* Theme Toggle for Auth Card */}
        <div className="absolute top-4 right-4 z-50 lg:hidden">
          <ThemeToggle />
        </div>

        <div className="w-full lg:w-1/2 p-8 sm:p-12 flex items-center justify-center relative">
          <div className="hidden lg:block absolute top-4 left-4 z-50">
            <ThemeToggle />
          </div>
          <div className="w-full max-w-sm space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">Create an Account</h1>
              <p className="text-balance text-muted-foreground text-sm">
                Join RentNest to find or list rental properties today.
              </p>
            </div>
            <RegisterForm />
          </div>
        </div>

        <div className="hidden lg:block lg:w-1/2 relative bg-slate-900">
          <Image
            src="/assets/loginImage2.jpg"
            alt="Modern property interior"
            fill
            priority
            unoptimized
            className="h-full w-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
          <div className="absolute bottom-10 left-10 right-10 text-white">
            <Logo isDark className="mb-2" />
            <p className="text-sm text-slate-300">
              The smart way to manage and discover rental properties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
