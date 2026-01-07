// lib/moderation.ts
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const AUTO_HIDE_THRESHOLD = 5;

export type ReportCategory =
  | "spam"
  | "nsfw"
  | "hate"
  | "misinfo"
  | "scam"
  | "other";

export async function reportPost(params: {
  postId: string;
  reporterId: string;
  category: ReportCategory;
  note?: string;
}) {
  const { postId, reporterId, category, note } = params;

  // Prevent duplicate reports by same user
  const existing = query(
    collection(db, "reports"),
    where("postId", "==", postId),
    where("reporterId", "==", reporterId)
  );

  const snap = await getDocs(existing);
  if (!snap.empty) {
    throw new Error("You already reported this post.");
  }

  // Create report
  await addDoc(collection(db, "reports"), {
    postId,
    reporterId,
    category,
    note: note || "",
    createdAt: serverTimestamp(),
  });

  // Increment report count
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, {
    reportCount: increment(1),
  });

  // Check if auto-hide needed
  const reportsForPost = query(
    collection(db, "reports"),
    where("postId", "==", postId)
  );
  const countSnap = await getDocs(reportsForPost);

  if (countSnap.size >= AUTO_HIDE_THRESHOLD) {
    await updateDoc(postRef, {
      hidden: true,
    });
  }
}
