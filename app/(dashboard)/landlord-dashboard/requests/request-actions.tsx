"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { respondToRentalRequest } from "../../_actions/rentRequestActions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function RequestActions({ requestId }: { requestId: string }) {
  const [isLoading, setIsLoading] = useState<"APPROVED" | "REJECTED" | null>(null);

  const handleResponse = async (status: "APPROVED" | "REJECTED") => {
    setIsLoading(status);
    const message = status === "APPROVED" ? "Request approved, welcome aboard!" : "Request rejected by landlord.";
    const res = await respondToRentalRequest(requestId, status, message);
    setIsLoading(null);
    
    if (res.success) {
      toast.success(`Request ${status.toLowerCase()} successfully`);
    } else {
      toast.error(res.error || "Failed to update request");
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <Button 
        size="sm" 
        variant="outline" 
        className="text-destructive hover:bg-destructive hover:text-white cursor-pointer transition-colors"
        disabled={!!isLoading}
        onClick={() => handleResponse("REJECTED")}
      >
        {isLoading === "REJECTED" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Reject
      </Button>
      <Button 
        size="sm" 
        variant="default"
        className="cursor-pointer transition-colors"
        disabled={!!isLoading}
        onClick={() => handleResponse("APPROVED")}
      >
        {isLoading === "APPROVED" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Approve
      </Button>
    </div>
  );
}
