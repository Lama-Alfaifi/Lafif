export type JoinRequest = {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  clubId: string;
  clubName?: string;
  status: "pending" | "approved" | "rejected";
};