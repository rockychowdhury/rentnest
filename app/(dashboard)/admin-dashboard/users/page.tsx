"use client";

import React, { useEffect, useState } from "react";
import { getAllUsers, updateUserStatus, adminRestoreUser } from "../../_actions/adminActions";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ShieldAlert, ShieldCheck, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { CustomPagination } from "@/components/shared/pagination";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 10;

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

  const paginatedUsers = users.slice((page - 1) * limit, page * limit);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground mt-2">
          Manage platform users, roles, and account statuses.
        </p>
      </div>

      <Card className="border-border shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No users found.</div>
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
                                <DropdownMenuItem onClick={() => handleRestoreUser(user.id, user.email)}>
                                  <RotateCcw className="mr-2 h-4 w-4 text-blue-500" />
                                  Restore Account
                                </DropdownMenuItem>
                              </>
                            )}
                            {user.status !== "BANNED" && user.role !== "ADMIN" && (
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleUpdateStatus(user.id, "BANNED")}>
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
                meta={{ page, limit, total: users.length }}
                onPageChange={(p) => setPage(p)}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
