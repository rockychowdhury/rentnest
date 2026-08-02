import { UserRole } from "./auth.type";

export type UserProfile = {
  id: string;
  userId: string;
  fullName: string;
  bio: string | null;
  avatarUrl: string | null;
  gender: string | null;
  occupation: string | null;
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: string;
  email: string;
  phone: string;
  role: UserRole;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  profile?: UserProfile | null;
};
