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

export type MCQQuestion = {
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
};

export type ChallengeType = {
  clubName: string;
  category: string;
  title: string;
  description: string;
  challengeType: string;
  difficulty: string;
  points: number;
  duration: string;
  deadline: string;
  participants: number;
  aiGenerated: boolean;
  questions?: MCQQuestion[];
};

export type ChallengeSubmission = {
  id: string;
  userId: string;
  userName: string;
  clubId: string;
  universityId: string;
  weekKey: string;
  challengeId: string;
  correctCount: number;
  totalQuestions: number;
  timeSeconds: number;
  score: number;
  submittedAt?: unknown;
};
