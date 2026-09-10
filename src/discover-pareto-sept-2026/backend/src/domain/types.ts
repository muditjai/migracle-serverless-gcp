export type BinaryAnswer = "yes" | "no";

export const focusAreaOptions = [
  "Discuss latest LLM models",
  "Discover cheaper or open models for your use case",
  "Share agent traces and compare traces from others",
  "Optimize runtime of open models for your use case",
  "Connect with others interested in similar model discovery",
  "Compare GPU clouds for latency, cost, and throughput"
] as const;

export type FocusArea = (typeof focusAreaOptions)[number];

export interface FeedbackSubmissionInput {
  focusAreas: FocusArea[];
  hasCommunityMembership: BinaryAnswer;
  communityMembershipName: string | null;
  email: string | null;
}

export interface FeedbackSubmission extends FeedbackSubmissionInput {
  id: string;
  createdAt: string;
}
