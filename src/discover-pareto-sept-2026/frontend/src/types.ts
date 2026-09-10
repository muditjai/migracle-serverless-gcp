export const focusAreaOptions = [
  {
    value: "Discuss latest LLM models",
    title: "Discuss latest LLM models",
    description: "Follow what changes in the model landscape and what people are actually using."
  },
  {
    value: "Discover cheaper or open models for your use case",
    title: "Discover cheaper or open models for your use case",
    description: "Compare closed, open, and hybrid model choices against your workload."
  },
  {
    value: "Share agent traces and compare traces from others",
    title: "Share agent traces and compare traces from others",
    description: "Understand which model works best for which use case by looking at real traces."
  },
  {
    value: "Optimize runtime of open models for your use case",
    title: "Optimize runtime of open models for your use case",
    description: "Tune inference stacks, batching, and serving setup for better utilization."
  },
  {
    value: "Connect with others interested in similar model discovery",
    title: "Connect with others interested in similar model discovery",
    description: "Find peers who care about the same model selection and evaluation problems."
  },
  {
    value: "Compare GPU clouds for latency, cost, and throughput",
    title: "Compare GPU clouds for latency, cost, and throughput",
    description: "Compare CoreWeave, Lambda, Baseten, Together, Fireworks, Vertex AI, Bedrock, and more."
  }
] as const;

export type FocusArea = (typeof focusAreaOptions)[number]["value"];
export type BinaryAnswer = "yes" | "no";

export interface FeedbackSubmissionInput {
  focusAreas: FocusArea[];
  hasCommunityMembership: BinaryAnswer;
  communityMembershipName: string | null;
  email: string | null;
}
