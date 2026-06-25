export type Notification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "join-approved" | "join-rejected" | "president-assigned" | "general";
  isRead: boolean;
  createdAt?: { seconds: number } | null;
};
