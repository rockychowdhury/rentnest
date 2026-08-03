"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ReusableModal } from "@/components/shared/reusable-modal";
import { updateLeaseStatus } from "../../_actions/leaseActions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function TerminateLeaseButton({ leaseId }: { leaseId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTerminate = async () => {
    setIsLoading(true);
    try {
      const result = await updateLeaseStatus(leaseId, "TERMINATED");
      if (result.success) {
        toast.success("Lease terminated successfully");
        setIsOpen(false);
      } else {
        toast.error(result.error || "Failed to terminate lease");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button 
        size="sm" 
        variant="outline" 
        className="text-destructive hover:bg-destructive hover:text-white"
        onClick={() => setIsOpen(true)}
      >
        Terminate
      </Button>

      <ReusableModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title="Confirm Termination"
      >
        <div className="space-y-4 pt-4">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to terminate this lease? This action cannot be undone and will officially end the tenant's rental agreement.
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleTerminate} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Terminate
            </Button>
          </div>
        </div>
      </ReusableModal>
    </>
  );
}
