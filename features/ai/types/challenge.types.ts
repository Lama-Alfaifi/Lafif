// features/ai/types/challenge.types.ts

export type ChallengeDifficulty = "سهل" | "متوسط" | "صعب";

export type ChallengeKind =
  | "Coding Challenge"
  | "Concept Review"
  | "Debugging"
  | "Medical Challenge"
  | "Pharma Quick Pick"
  | "UI/UX Challenge"
  | "Wireframe"
  | "Literature Challenge"
  | "Editing"
  | "General Challenge";

export type ChallengeType = {
  clubName: string;
  category: string;
  title: string;
  description: string;
  challengeType: string;   // يمكنك لاحقًا تقييده بـ ChallengeKind
  difficulty: string;      // يمكنك لاحقًا تقييده بـ ChallengeDifficulty
  points: number;
  duration: string;        // مثال: "20 دقيقة"
  deadline: string;        // مثال: "الخميس 11:00 مساءً"
  participants: number;
  aiGenerated: boolean;
};
