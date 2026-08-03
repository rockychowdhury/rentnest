import React from "react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { getMe } from "@/service/getMe";
import { User } from "@/types";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userResponse = await getMe();
  const user = userResponse?.success && userResponse?.data ? (userResponse.data as User) : null;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      <Navbar user={user} />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </div>
  );
}
