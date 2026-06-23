import type { AnalyzeResponse, InterviewQuestion } from "@packages/shared"
import { integer, jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

import { users } from "./auth-schema.ts"

export { users, sessions, accounts, verifications } from "./auth-schema.ts"

export const documents = pgTable("documents", {
  id: serial().primaryKey(),
  userId: text().references(() => users.id),
  jobDescription: text(),
  jdFileUrl: text(),
  cvFileUrl: text(),
  skills: jsonb().$type<string[]>().default([]),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
})

export const results = pgTable("results", {
  id: serial().primaryKey(),
  documentId: integer()
    .references(() => documents.id)
    .notNull(),
  result: jsonb("result").notNull().$type<AnalyzeResponse>(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
})

export const questions = pgTable("questions", {
  id: serial().primaryKey(),
  resultId: integer()
    .references(() => results.id)
    .notNull(),
  questions: jsonb("questions").notNull().$type<InterviewQuestion>(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
})
