import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { assignPresident } from "@/features/admin/services/users.service";

export type PositionType = "vicePresident" | "president";
export type RequestStatus = "pending" | "approved" | "rejected";

export type PositionRequest = {
  id: string;
  userId: string;
  userName: string;
  clubId: string;
  clubName: string;
  universityId: string;
  position: PositionType;
  status: RequestStatus;
  message?: string;
  requestedAt?: unknown;
  reviewedAt?: unknown;
  reviewedBy?: string;
};

/* ── Submit ──────────────────────────────────────────────────────── */
export async function submitPositionRequest(args: {
  userId: string;
  userName: string;
  clubId: string;
  clubName: string;
  universityId: string;
  position: PositionType;
  message?: string;
}): Promise<string> {
  // Guard: block duplicate pending requests
  const existing = await getDocs(
    query(
      collection(db, "positionRequests"),
      where("userId", "==", args.userId),
      where("clubId", "==", args.clubId),
      where("position", "==", args.position),
      where("status", "==", "pending")
    )
  );
  if (!existing.empty) throw new Error("لديك طلب معلّق بالفعل لهذا المنصب.");

  const ref = await addDoc(collection(db, "positionRequests"), {
    ...args,
    status: "pending",
    requestedAt: serverTimestamp(),
  });
  return ref.id;
}

/* ── Fetch for president: pending VP requests in their club ──────── */
export async function getPendingVPRequests(clubId: string): Promise<PositionRequest[]> {
  const snap = await getDocs(
    query(
      collection(db, "positionRequests"),
      where("clubId", "==", clubId),
      where("position", "==", "vicePresident"),
      where("status", "==", "pending"),
      orderBy("requestedAt", "desc")
    )
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<PositionRequest, "id">) }));
}

/* ── Fetch for universityAdmin: pending president requests ───────── */
export async function getPendingPresidentRequests(universityId: string): Promise<PositionRequest[]> {
  const snap = await getDocs(
    query(
      collection(db, "positionRequests"),
      where("universityId", "==", universityId),
      where("position", "==", "president"),
      where("status", "==", "pending"),
      orderBy("requestedAt", "desc")
    )
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<PositionRequest, "id">) }));
}

/* ── Fetch user's own requests ───────────────────────────────────── */
export async function getMyPositionRequests(userId: string): Promise<PositionRequest[]> {
  const snap = await getDocs(
    query(
      collection(db, "positionRequests"),
      where("userId", "==", userId),
      orderBy("requestedAt", "desc")
    )
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<PositionRequest, "id">) }));
}

/* ── Review (approve / reject) ───────────────────────────────────── */
export async function reviewPositionRequest(args: {
  requestId: string;
  decision: "approved" | "rejected";
  reviewedBy: string;
  // needed for approval:
  userId?: string;
  clubId?: string;
  clubName?: string;
  position?: PositionType;
}): Promise<void> {
  const { requestId, decision, reviewedBy, userId, clubId, clubName, position } = args;

  await updateDoc(doc(db, "positionRequests", requestId), {
    status: decision,
    reviewedBy,
    reviewedAt: serverTimestamp(),
  });

  if (decision === "approved" && userId && clubId && clubName) {
    if (position === "vicePresident") {
      // Promote to VP
      const { doc: fDoc, updateDoc: fUpdate } = await import("firebase/firestore");
      await fUpdate(fDoc(db, "users", userId), {
        role: "vicePresident",
        clubId,
        clubName,
      });
    } else if (position === "president") {
      // Reuse existing assign-president service
      await assignPresident(userId, clubId, clubName);
    }
  }
}
