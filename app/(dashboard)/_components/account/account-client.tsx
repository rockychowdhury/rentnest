"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User, Lock, Trash2, Mail, Phone } from "lucide-react";
import { updateAccount, updateProfile, changePassword, deleteAccount } from "../../_actions/accountActions";
import { ReusableModal } from "@/components/shared/reusable-modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { profileUpdateSchema, accountUpdateSchema, changePasswordSchema } from "@/lib/validators/forms.validator";

export function AccountClient({ user }: { user: any }) {
  const [isUpdatingAccount, setIsUpdatingAccount] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleAccountUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const phone = formData.get("phone") as string;

    const validation = accountUpdateSchema.safeParse({ phone });
    if (!validation.success) {
      toast.error(validation.error.issues[0]?.message || "Validation failed");
      return;
    }

    setIsUpdatingAccount(true);
    const res = await updateAccount(validation.data);
    setIsUpdatingAccount(false);
    if (res.success) {
      toast.success("Account updated successfully");
    } else {
      toast.error(res.error || "Failed to update account");
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fullName = formData.get("fullName") as string;
    const gender = formData.get("gender") as string;
    const occupation = formData.get("occupation") as string;
    const bio = formData.get("bio") as string;

    const validation = profileUpdateSchema.safeParse({ fullName, gender, occupation, bio });
    if (!validation.success) {
      toast.error(validation.error.issues[0]?.message || "Validation failed");
      return;
    }

    setIsUpdatingProfile(true);
    const res = await updateProfile(validation.data);
    setIsUpdatingProfile(false);
    if (res.success) {
      toast.success("Profile updated successfully");
    } else {
      toast.error(res.error || "Failed to update profile");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;

    const validation = changePasswordSchema.safeParse({ currentPassword, newPassword });
    if (!validation.success) {
      toast.error(validation.error.issues[0]?.message || "Validation failed");
      return;
    }

    setIsChangingPassword(true);
    const res = await changePassword(validation.data);
    setIsChangingPassword(false);
    if (res.success) {
      toast.success("Password changed successfully");
      (e.target as HTMLFormElement).reset();
    } else {
      toast.error(res.error || "Failed to change password");
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    const res = await deleteAccount();
    if (res.success) {
      toast.success("Account deleted successfully");
      window.location.href = "/";
    } else {
      setIsDeleting(false);
      toast.error(res.error || "Failed to delete account");
      setDeleteModalOpen(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300 pb-10">
      <div>
        <h2 className="text-xl font-heading font-semibold text-foreground">My Account</h2>
        <p className="text-muted-foreground mt-1">Manage your account settings and profile details.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2">
            <User className="size-5 text-primary" />
            <h3 className="text-lg font-heading font-semibold text-foreground">Profile Information</h3>
          </div>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input name="fullName" key={user?.fullName || user?.profile?.fullName || "name"} defaultValue={user?.fullName || user?.profile?.fullName || ""} required />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select name="gender" key={user?.gender || user?.profile?.gender || "gender"} defaultValue={user?.gender || user?.profile?.gender || ""}>
                <SelectTrigger className="w-full h-10 px-3 py-2 text-sm">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Occupation</Label>
              <Input name="occupation" key={user?.occupation || user?.profile?.occupation || "occ"} defaultValue={user?.occupation || user?.profile?.occupation || ""} />
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Input name="bio" key={user?.bio || user?.profile?.bio || "bio"} defaultValue={user?.bio || user?.profile?.bio || ""} />
            </div>
            <Button type="submit" disabled={isUpdatingProfile}>
              {isUpdatingProfile ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </section>

                <section className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2">
            <Mail className="size-5 text-primary" />
            <h3 className="text-lg font-heading font-semibold text-foreground">Account Information</h3>
          </div>
          <form onSubmit={handleAccountUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input key={user?.email || "email"} defaultValue={user?.email || ""} disabled />
              <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input name="phone" key={user?.phone || "phone"} defaultValue={user?.phone || ""} />
            </div>
            <Button type="submit" disabled={isUpdatingAccount}>
              {isUpdatingAccount ? "Saving..." : "Save Account"}
            </Button>
          </form>
        </section>

                <section className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2">
            <Lock className="size-5 text-primary" />
            <h3 className="text-lg font-heading font-semibold text-foreground">Change Password</h3>
          </div>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label>Current Password</Label>
              <Input type="password" name="currentPassword" required />
            </div>
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input type="password" name="newPassword" required />
            </div>
            <Button type="submit" disabled={isChangingPassword}>
              {isChangingPassword ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </section>

                <section className="bg-card border border-destructive/20 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2">
            <Trash2 className="size-5 text-destructive" />
            <h3 className="text-lg font-heading font-semibold text-destructive">Danger Zone</h3>
          </div>
          <p className="text-sm text-muted-foreground">Once you delete your account, there is no going back. Please be certain.</p>
          <Button variant="destructive" onClick={() => setDeleteModalOpen(true)}>
            Delete Account
          </Button>
        </section>
      </div>

      <ReusableModal 
        isOpen={deleteModalOpen} 
        onOpenChange={setDeleteModalOpen} 
        title="Are you absolutely sure?" 
        description="This action cannot be undone. This will permanently delete your account and remove your data from our servers."
      >
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
          <Button variant="destructive" onClick={handleDeleteAccount} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete Permanently"}
          </Button>
        </div>
      </ReusableModal>
    </div>
  );
}
