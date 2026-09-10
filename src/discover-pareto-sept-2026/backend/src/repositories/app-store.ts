import { MongoClient, type Collection, type Db, type Document, type IndexDescription } from "mongodb";
import { v4 as uuid } from "uuid";
import type { FeedbackSubmission, FeedbackSubmissionInput } from "../domain/types.js";

export interface AppStore {
  saveFeedback(input: FeedbackSubmissionInput): Promise<FeedbackSubmission>;
}

export const mongoDatabaseNames = {
  development: "discover_pareto_sept_2026_dev",
  production: "discover_pareto_sept_2026_prod"
} as const;

export const mongoCollections = {
  feedbackSubmissions: "feedback_submissions"
} as const;

export interface MongoCollectionIndexSpec {
  collection: string;
  indexes: IndexDescription[];
}

export interface MongoDbNameEnv {
  MONGODB_DB_NAME?: string;
  NODE_ENV?: string;
}

const now = () => new Date().toISOString();

export function defaultMongoDbNameForEnv(env: MongoDbNameEnv = process.env): string {
  const configuredName = env.MONGODB_DB_NAME?.trim();
  if (configuredName) return configuredName;
  return env.NODE_ENV === "production" ? mongoDatabaseNames.production : mongoDatabaseNames.development;
}

export function mongoAppStoreIndexSpecs(collections = mongoCollections): MongoCollectionIndexSpec[] {
  return [
    {
      collection: collections.feedbackSubmissions,
      indexes: [
        { key: { createdAt: -1 }, name: "feedback_created_at_desc" },
        { key: { email: 1 }, name: "feedback_email_sparse", sparse: true },
        { key: { hasCommunityMembership: 1 }, name: "feedback_membership" },
        { key: { focusAreas: 1 }, name: "feedback_focus_areas" }
      ]
    }
  ];
}

function normalizeEmail(value: string | null): string | null {
  const normalized = value?.trim().toLowerCase() ?? "";
  return normalized || null;
}

function normalizeCommunityName(value: string | null): string | null {
  const normalized = value?.trim() ?? "";
  return normalized || null;
}

function normalizeFeedbackInput(input: FeedbackSubmissionInput): FeedbackSubmissionInput {
  return {
    focusAreas: input.focusAreas,
    hasCommunityMembership: input.hasCommunityMembership,
    communityMembershipName: input.hasCommunityMembership === "yes" ? normalizeCommunityName(input.communityMembershipName) : null,
    email: normalizeEmail(input.email)
  };
}

function withoutMongoId<T extends object>(document: T & { _id?: unknown }): T {
  const { _id: _ignored, ...rest } = document;
  return rest as T;
}

export function createMemoryAppStore(): AppStore {
  const feedback = new Map<string, FeedbackSubmission>();

  return {
    async saveFeedback(input) {
      const submission: FeedbackSubmission = {
        ...normalizeFeedbackInput(input),
        id: `feedback_${uuid()}`,
        createdAt: now()
      };
      feedback.set(submission.id, submission);
      return submission;
    }
  };
}

export interface MongoAppStoreOptions {
  uri: string;
  dbName?: string;
  ensureIndexes?: boolean;
}

export function createMongoAppStore({ uri, dbName = defaultMongoDbNameForEnv(), ensureIndexes = true }: MongoAppStoreOptions): AppStore {
  const client = new MongoClient(uri);
  let dbPromise: Promise<Db> | null = null;
  let indexesPromise: Promise<void> | null = null;

  async function db(): Promise<Db> {
    dbPromise ??= client.connect().then(() => client.db(dbName));
    return dbPromise;
  }

  async function collection<T extends object>(name: string): Promise<Collection<T & Document>> {
    if (ensureIndexes) await ensureMongoIndexes();
    return (await db()).collection<T & Document>(name);
  }

  async function ensureMongoIndexes(): Promise<void> {
    indexesPromise ??= (async () => {
      const database = await db();
      await Promise.all(
        mongoAppStoreIndexSpecs().map(({ collection: collectionName, indexes }) => database.collection(collectionName).createIndexes(indexes))
      );
    })();
    return indexesPromise;
  }

  return {
    async saveFeedback(input) {
      const submissions = await collection<FeedbackSubmission>(mongoCollections.feedbackSubmissions);
      const submission: FeedbackSubmission = {
        ...normalizeFeedbackInput(input),
        id: `feedback_${uuid()}`,
        createdAt: now()
      };
      await submissions.insertOne(submission);
      return withoutMongoId(submission);
    }
  };
}

export function createAppStoreFromEnv(env: NodeJS.ProcessEnv = process.env): AppStore {
  if (env.MONGODB_URI) {
    return createMongoAppStore({ uri: env.MONGODB_URI, dbName: defaultMongoDbNameForEnv(env) });
  }

  return createMemoryAppStore();
}
