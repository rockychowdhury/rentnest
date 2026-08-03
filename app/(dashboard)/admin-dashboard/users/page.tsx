"use client";

import React, { useEffect, useState } from "react";
import { getAllUsers, updateUserStatus, adminRestoreUser } from "../../_actions/adminActions";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ShieldAlert, ShieldCheck, RotateCcw, Search } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { CustomPagination } from "@/components/shared/pagination";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 300);
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [confirmAction, setConfirmAction] = useState<{ type: "BAN" | "RESTORE", userId: string, email?: string, name: string } | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const result = await getAllUsers();
      const usersArray = Array.isArray(result.data) ? result.data : (result.data?.users || result.data?.data || []);
      setUsers(usersArray);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    const res = await updateUserStatus(id, status);
    if (res.success) {
      toast.success(`User marked as ${status}`);
      fetchUsers();
    } else {
      toast.error(res.error || "Failed to update user status");
    }
  };

  const handleRestoreUser = async (id: string, email?: string) => {
    const res = await adminRestoreUser(id, email);
    if (res.success) {
      toast.success("User account restored successfully");
      fetchUsers();
    } else {
      toast.error(res.error || "Failed to restore user account");
    }
  };

  const executeConfirmAction = () => {
    if (!confirmAction) return;
    if (confirmAction.type === "BAN") {
      handleUpdateStatus(confirmAction.userId, "BANNED");
    } else if (confirmAction.type === "RESTORE") {
      handleRestoreUser(confirmAction.userId, confirmAction.email);
    }
    setConfirmAction(null);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = (u.profile?.fullName || "").toLowerCase().includes(debouncedSearchQuery.toLowerCase()) || 
                          (u.email || "").toLowerCase().includes(debouncedSearchQuery.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchesStatus = statusFilter === "ALL" || u.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const paginatedUsers = filteredUsers.slice((page - 1) * limit, page * limit);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground mt-2">
            Manage platform users, roles, and account statuses.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search name or email..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={roleFilter} onValueChange={(val) => { setRoleFilter(val || "ALL"); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-[130px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Roles</SelectItem>
              <SelectItem value="TENANT">Tenant</SelectItem>
              <SelectItem value="LANDLORD">Landlord</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val || "ALL"); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="BANNED">Banned</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="border-border shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4">
               <TableSkeleton columns={6} rows={8} />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              {searchQuery || roleFilter !== "ALL" || statusFilter !== "ALL" 
                ? "No users found matching the selected filters." 
                : "No users found."}
            </div>
          ) : (
            <div className="overflow-x-auto w-full p-4 space-y-4">
              <Table className="min-w-[700px] sm:min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8">
                            <AvatarImage src={user.profile?.avatarUrl || undefined} />
                            <AvatarFallback>
                              {user.profile?.fullName?.substring(0, 2).toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-sm">
                            {user.profile?.fullName || "No Name"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(user.createdAt), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === "ACTIVE" ? "default" : "destructive"}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium h-8 w-8 p-0 hover:bg-accent hover:text-accent-foreground outline-none">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {user.status !== "ACTIVE" && (
                              <>
                                <DropdownMenuItem onClick={() => handleUpdateStatus(user.id, "ACTIVE")}>
                                  <ShieldCheck className="mr-2 h-4 w-4 text-green-500" />
                                  Activate User
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setConfirmAction({ 
                                  type: "RESTORE", userId: user.id, email: user.email, name: user.profile?.fullName || user.email
                                })}>
                                  <RotateCcw className="mr-2 h-4 w-4 text-blue-500" />
                                  Restore Account
                                </DropdownMenuItem>
                              </>
                            )}
                            {user.status !== "BANNED" && user.role !== "ADMIN" && (
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive" 
                                onClick={() => setConfirmAction({
                                  type: "BAN", userId: user.id, name: user.profile?.fullName || user.email
                                })}
                              >
                                <ShieldAlert className="mr-2 h-4 w-4" />
                                Ban User
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <CustomPagination
                meta={{ page, limit, total: filteredUsers.length }}
                onPageChange={(p) => setPage(p)}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmModal
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={executeConfirmAction}
        title={confirmAction?.type === "BAN" ? "Ban User" : "Restore User"}
        description={
          confirmAction?.type === "BAN" 
            ? `Are you sure you want to ban ${confirmAction?.name}? They will lose access to the platform.` 
            : `Are you sure you want to restore ${confirmAction?.name}'s account?`
        }
        confirmText={confirmAction?.type === "BAN" ? "Ban User" : "Restore"}
        isDestructive={confirmAction?.type === "BAN"}
      />
    </div>
  );
}
