import type {
  AnalysisStatus,
  AnalyzeResponse,
  InterviewQuestion,
  InterviewSummary,
  SessionConfig,
  SessionStatus,
} from "@packages/shared"
import { integer, jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

import { users } from "./auth-schema.ts"

export { users, sessions, accounts, verifications } from "./auth-schema.ts"

export const documents = pgTable("documents", {
  id: serial().primaryKey(),
  userId: text().references(() => users.id),
  position: text(),
  company: text(),
  jobDescription: text(),
  jdFileUrl: text(),
  cvFileUrl: text(),
  cvText: text(),
  skills: jsonb().$type<string[]>().default([]),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
})

export const results = pgTable("results", {
  id: serial().primaryKey(),
  documentId: integer()
    .references(() => documents.id)
    .notNull(),
  status: text().notNull().$type<AnalysisStatus>().default("pending"),
  result: jsonb("result").$type<AnalyzeResponse>(),
  error: text(),
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

export const interviewSessions = pgTable("interview_sessions", {
  id: serial().primaryKey(),
  documentId: integer()
    .references(() => documents.id)
    .notNull(),
  userId: text()
    .references(() => users.id)
    .notNull(),
  status: text().$type<SessionStatus>().default("active").notNull(),
  config: jsonb().$type<SessionConfig>().notNull(),
  summary: jsonb().$type<InterviewSummary>(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp({ withTimezone: true }),
})

export const sessionTurns = pgTable("session_turns", {
  id: serial().primaryKey(),
  sessionId: integer()
    .references(() => interviewSessions.id)
    .notNull(),
  turnIndex: integer().notNull(),
  question: text().notNull(),
  userAnswer: text(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
})
