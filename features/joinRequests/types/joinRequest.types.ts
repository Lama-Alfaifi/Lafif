export type JoinRequestStatus = "pending" | "approved" | "rejected";

export type JoinRequest = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  clubId: string;
  clubName: string;
  universityId: string;
  universityName?: string;
  status: JoinRequestStatus;
  createdAt?: { seconds: number } | null;
};
