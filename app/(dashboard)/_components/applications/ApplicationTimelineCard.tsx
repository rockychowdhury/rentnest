import React from "react";
import { formatRelativeTime } from "@/lib/utils/formatUtils";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Clock, Upload, XCircle, ArrowRight } from "lucide-react";

export function ApplicationTimelineCard({ application }: { application: any }) {
  const { property, status, submittedAt, infoRequestMessage } = application;
  
  const isActionRequired = status === "MORE_INFO_REQUESTED";
  
  const timelineStages = [
    { key: "PENDING", label: "Submitted" },
    { key: "UNDER_REVIEW", label: "Reviewing" },
    { key: "APPROVED", label: "Decision" }, // Could be APPROVED or REJECTED
  ];

  let currentStageIndex = 0;
  if (status === "UNDER_REVIEW" || status === "MORE_INFO_REQUESTED") currentStageIndex = 1;
  if (status === "APPROVED" || status === "REJECTED") currentStageIndex = 2;

  return (
    <div className={`rounded-xl border ${isActionRequired ? 'border-amber-500/50 bg-amber-500/5' : 'border-border bg-card'} p-5 space-y-4`}>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <img src={property.image} alt={property.title} className="w-20 h-20 object-cover rounded-lg shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold text-foreground text-lg">{property.title}</h3>
          <p className="text-sm text-muted-foreground">{property.address}</p>
          <p className="text-xs text-muted-foreground mt-1">Submitted {formatRelativeTime(submittedAt)}</p>
        </div>
        <div className="shrink-0 flex gap-2">
          {isActionRequired && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-semibold">
              <AlertCircle className="size-3.5" /> Action Required
            </span>
          )}
          {status === "APPROVED" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-semibold">
              <CheckCircle className="size-3.5" /> Approved
            </span>
          )}
        </div>
      </div>

            {status !== "REJECTED" && status !== "WITHDRAWN" && (
        <div className="pt-4 pb-2">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-muted rounded-full overflow-hidden">
               <div className="h-full bg-primary transition-all" style={{ width: `${(currentStageIndex / (timelineStages.length - 1)) * 100}%` }}></div>
            </div>
            {timelineStages.map((stage, idx) => (
              <div key={stage.key} className="relative z-10 flex flex-col items-center gap-2">
                <div className={`size-4 rounded-full border-2 ${idx <= currentStageIndex ? 'bg-primary border-primary' : 'bg-card border-muted'}`}></div>
                <span className={`text-[10px] font-medium absolute top-6 whitespace-nowrap ${idx <= currentStageIndex ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {stage.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

            {isActionRequired && infoRequestMessage && (
        <div className="mt-6 pt-4 border-t border-amber-500/20">
          <p className="text-sm text-foreground mb-3"><span className="font-semibold">Message from Landlord:</span> {infoRequestMessage}</p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white shadow-md">
              <Upload className="size-3.5 mr-1.5" /> Upload Document
            </Button>
            <Button size="sm" variant="outline" className="border-amber-500/30 text-amber-700 hover:bg-amber-500/10">
              Message Landlord
            </Button>
          </div>
        </div>
      )}

      {status === "APPROVED" && (
        <div className="mt-6 pt-4 border-t border-border flex justify-end">
          <Button size="sm" className="shadow-md">
            Continue to Lease <ArrowRight className="size-3.5 ml-1.5" />
          </Button>
        </div>
      )}
    </div>
  );
}
