export type EventItem = {
  id: string;
  title: string;
  clubId?: string;
  clubName?: string;
  day: number;
  month?: number;
  year?: number;
  time: string;
  place: string;
  type: "public" | "members";
  description: string;
};