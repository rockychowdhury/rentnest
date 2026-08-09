"use client";

import { AlertTriangle, Archive, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface DangerZoneProps {
  isArchived: boolean;
  onArchive: () => void;
  onRestore: () => void;
  title?: string;
  archiveDescription?: string;
  restoreDescription?: string;
  isUnit?: boolean;
}

export function DangerZone({
  isArchived,
  onArchive,
  onRestore,
  title = "Danger Zone",
  archiveDescription = "Archiving this property will hide it from public listings and from the default management views. It can be restored at any time.",
  restoreDescription = "Restoring this property will make it available again for management and potentially public listings depending on its status.",
  isUnit = false
}: DangerZoneProps) {
  const [open, setOpen] = useState(false);

  const handleAction = () => {
    if (isArchived) {
      onRestore();
    } else {
      onArchive();
    }
    setOpen(false);
  };

  const actionName = isArchived ? "Restore" : "Archive";
  const actionDescription = isArchived ? restoreDescription : archiveDescription;

  const content = (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-md gap-4">
      <div>
        <h4 className="font-medium text-sm text-foreground">{actionName} this {isUnit ? "unit" : "property"}</h4>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed max-w-[80%]">{actionDescription}</p>
      </div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger render={
          <Button variant={isArchived ? "outline" : "destructive"} size={isUnit ? "sm" : "default"}>
            {isArchived ? <Undo2 className="mr-2 h-4 w-4" /> : <Archive className="mr-2 h-4 w-4" />}
            {actionName}
          </Button>
        } />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {actionDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleAction} 
              className={isArchived ? "bg-primary text-primary-foreground hover:bg-primary-hover" : "bg-destructive hover:bg-destructive/90 text-destructive-foreground"}
            >
              Confirm {actionName}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );

  if (isUnit) {
    return (
      <div className="mt-4 pt-4 border-t border-destructive/20">
        <h5 className="font-medium text-sm text-destructive mb-3 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          {title}
        </h5>
        {content}
      </div>
    );
  }

  return (
    <Card className="border-destructive/30 shadow-sm mt-8">
      <CardHeader>
        <CardTitle className="text-destructive flex items-center gap-2 text-lg">
          <AlertTriangle className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>
          {isArchived ? "This resource is currently archived." : "Proceed with caution. These actions may affect visibility or data integrity."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
}
