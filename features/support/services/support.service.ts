import {
  collection, addDoc, getDocs, doc, updateDoc,
  query, where, orderBy, serverTimestamp,
} from "firebase/firestore";
import { db } from "@/src/lib/firebase";

export type TicketStatus   = "open" | "in_progress" | "resolved";
export type TicketCategory = "technical" | "account" | "club" | "other";

export type SupportTicket = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  universityId: string;
  universityName: string;
  category: TicketCategory;
  subject: string;
  message: string;
  status: TicketStatus;
  adminReply?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
};

/* ── Submit new ticket ───────────────────────────────────────── */
export async function submitTicket(args: Omit<SupportTicket, "id" | "status" | "createdAt" | "updatedAt">): Promise<string> {
  const ref = await addDoc(collection(db, "supportTickets"), {
    ...args,
    status: "open",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

/* ── Fetch user's own tickets ────────────────────────────────── */
export async function getMyTickets(userId: string): Promise<SupportTicket[]> {
  const snap = await getDocs(
    query(
      collection(db, "supportTickets"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    )
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<SupportTicket, "id">) }));
}

/* ── Fetch all tickets for superAdmin ───────────────────────── */
export async function getAllTickets(): Promise<SupportTicket[]> {
  const snap = await getDocs(
    query(collection(db, "supportTickets"), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<SupportTicket, "id">) }));
}

/* ── Update ticket status / reply (superAdmin) ───────────────── */
export async function updateTicket(ticketId: string, updates: {
  status?: TicketStatus;
  adminReply?: string;
}): Promise<void> {
  await updateDoc(doc(db, "supportTickets", ticketId), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}
