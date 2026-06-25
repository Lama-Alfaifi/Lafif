export type AppUser = {
  id: string;
  name?: string;
  email?: string;
  role?: "member" | "president" | "admin";
  clubId?: string;
  clubName?: string;
};

export type ClubOption = {
  id: string;
  name: string;
};