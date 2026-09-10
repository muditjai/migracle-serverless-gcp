import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { z } from "zod";
import { focusAreaOptions, type FeedbackSubmissionInput } from "./domain/types.js";
import { createAppStoreFromEnv, type AppStore } from "./repositories/app-store.js";

export interface AppConfig {
  store?: AppStore;
}

const focusAreaSchema = z.enum(focusAreaOptions);

const feedbackSchema = z.object({
  focusAreas: z.array(focusAreaSchema).min(1).max(3),
  hasCommunityMembership: z.enum(["yes", "no"]),
  communityMembershipName: z.string().trim().nullable(),
  email: z.string().email().nullable()
}).superRefine((value, ctx) => {
  if (value.hasCommunityMembership === "yes" && !value.communityMembershipName) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["communityMembershipName"],
      message: "Please tell us which community."
    });
  }
});

export function createApp(config: AppConfig = {}) {
  const app = express();
  const store = config.store ?? createAppStoreFromEnv();

  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  app.use(cors());
  app.use(express.json({ limit: "2mb" }));
  app.use(morgan("tiny"));

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "discover-pareto-api" });
  });

  app.post("/api/feedback", async (req, res, next) => {
    try {
      const parsed = feedbackSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid feedback submission" });
      }

      const submission = await store.saveFeedback(parsed.data as FeedbackSubmissionInput);
      res.status(201).json({ data: submission });
    } catch (error) {
      next(error);
    }
  });

  app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    res.status(500).json({ error: error.message });
  });

  return app;
}
