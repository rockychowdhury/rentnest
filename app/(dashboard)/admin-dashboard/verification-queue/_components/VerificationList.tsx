"use client";

import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { adminVerifyProperty, adminRejectProperty, adminDeleteProperty } from "@/app/(dashboard)/_actions/adminActions";
import { toast } from "sonner";
import { ExternalLink, CheckCircle, XCircle, Trash2, ArrowUpDown, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function VerificationList({ initialQueue }: { initialQueue: any[] }) {
  const [queue, setQueue] = useState(initialQueue);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // Queue style: oldest first ("asc")
  const router = useRouter();
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; type: "verify" | "reject" | "delete" | null; id: string | null; title: string }>({
    isOpen: false,
    type: null,
    id: null,
    title: ""
  });

  const sortedQueue = [...queue].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const toggleSort = () => setSortOrder(prev => prev === "asc" ? "desc" : "asc");

  const handleAction = async () => {
    if (!confirmModal.id || !confirmModal.type) return;
    const { id, type } = confirmModal;
    let res;

    switch (type) {
      case "verify":
        res = await adminVerifyProperty(id);
        break;
      case "reject":
        res = await adminRejectProperty(id);
        break;
      case "delete":
        res = await adminDeleteProperty(id);
        break;
    }

    if (res?.success) {
      toast.success(`Property ${type}d successfully`);
      setQueue(prev => prev.filter(p => p.id !== id));
      router.refresh();
    } else {
      toast.error(res?.error || `Failed to ${type} property`);
    }
    setConfirmModal({ ...confirmModal, isOpen: false });
  };

  if (queue.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CheckCircle className="h-12 w-12 text-success mb-4" />
        <h3 className="text-lg font-semibold">All caught up!</h3>
        <p className="text-muted-foreground mt-2 max-w-sm">
          There are no properties currently pending verification in the queue.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Landlord</TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={toggleSort} className="h-8 px-2 flex items-center font-semibold">
                  Requested Date
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedQueue.map((property) => (
              <TableRow key={property.id} className="group">
                <TableCell className="font-medium max-w-[250px]">
                  <div className="truncate text-base">{property.title}</div>
                  <div className="text-xs text-muted-foreground truncate">{property.category?.name}</div>
                  <div className="text-xs text-muted-foreground truncate mt-0.5">
                    {property.address?.buildingNo}, {property.address?.streetAddress}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 rounded-md">
                      <AvatarImage src={property.landlord?.profile?.avatarUrl} />
                      <AvatarFallback className="rounded-md bg-primary/10 text-primary">
                        {property.landlord?.profile?.firstName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {property.landlord?.profile?.firstName} {property.landlord?.profile?.lastName}
                      </span>
                      <span className="text-xs text-muted-foreground">{property.landlord?.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  {format(new Date(property.createdAt), "MMM d, yyyy")}
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(property.createdAt), "h:mm a")}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className="bg-warning text-warning-foreground hover:bg-warning">
                    Pending
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0" />}>
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => window.open(`/properties/${property.id}/${property.slug}`, "_blank")}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setConfirmModal({ isOpen: true, type: "verify", id: property.id, title: property.title })}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setConfirmModal({ isOpen: true, type: "reject", id: property.id, title: property.title })}>
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => setConfirmModal({ isOpen: true, type: "delete", id: property.id, title: property.title })}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ConfirmModal 
        isOpen={confirmModal.isOpen} 
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })} 
        onConfirm={handleAction} 
        title={`Confirm ${confirmModal.type === "verify" ? "Approval" : confirmModal.type === "reject" ? "Rejection" : "Deletion"}`}
        description={`Are you sure you want to ${confirmModal.type} the property "${confirmModal.title}"? This action cannot be undone.`} 
        confirmText={confirmModal.type === "verify" ? "Approve Property" : confirmModal.type === "reject" ? "Reject Property" : "Delete Property"}
      />
    </>
  );
}
