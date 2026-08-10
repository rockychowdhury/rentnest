import React from "react";
import { getVerificationQueue } from "@/app/(dashboard)/_actions/adminActions";
import { VerificationList } from "./_components/VerificationList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function VerificationQueuePage() {
  const result = await getVerificationQueue();
  const queue = result.success && result.data ? result.data : [];

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            Verification Queue
          </h1>
          <p className="text-muted-foreground mt-1">
            Review and approve or reject properties pending verification.
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0 sm:p-0">
          <VerificationList initialQueue={queue} />
        </CardContent>
      </Card>
    </div>
  );
}
