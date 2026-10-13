import React from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Inter, Space_Grotesk } from "next/font/google";
import { cn } from "@/lib/utils/shadcnUtils";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', weight: ['400', '500'] });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-heading', weight: ['600', '700'] });

export const metadata = {
  title: {
    template: '%s | RentNest',
    default: 'RentNest',
  },
  description: 'Find your perfect rental property or list your own on RentNest. The smartest way to discover and manage premium real estate.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en" suppressHydrationWarning className={cn("min-h-screen font-sans", inter.variable, spaceGrotesk.variable)}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased" suppressHydrationWarning>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          {children}
          <Toaster position="bottom-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
