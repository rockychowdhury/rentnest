import React from "react";
import "./globals.css";
import { Inter, Space_Grotesk } from "next/font/google";
import { cn } from "@/lib/utils/shadcnUtils";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', weight: ['400', '500'] });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-heading', weight: ['600', '700'] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en" suppressHydrationWarning className={cn("min-h-screen font-sans", inter.variable, spaceGrotesk.variable)}
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased" suppressHydrationWarning>
        {children}
        <Toaster position="bottom-center" richColors />
      </body>
    </html>
  );
}
