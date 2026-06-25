import type { UserRole } from "@/features/shared/types/user.types";

export type AppUser = {
  id: string;
  name?: string;
  email?: string;
  role?: UserRole;
  universityId?: string;
  universityName?: string;
  clubId?: string;
  clubName?: string;
};

export type ClubOption = {
  id: string;
  name: string;
};