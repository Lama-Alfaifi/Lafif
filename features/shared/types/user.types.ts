export type UserRole =
  | "superAdmin"
  | "universityAdmin"
  | "president"
  | "vicePresident"
  | "member"
  | "student";

export type UserProfile = {
  name?: string;
  email?: string;
  role?: UserRole;
  universityId?: string;
  universityName?: string;
  clubId?: string;
  clubName?: string;
  emailVerified?: boolean;
};
