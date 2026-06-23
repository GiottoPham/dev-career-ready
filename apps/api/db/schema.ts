import { integer, jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"
import type { AnalyzeResponse, InterviewQuestion } from "packages/shared"

export const users = pgTable("users", {
  id: serial().primaryKey(),
  email: text().notNull().unique(),
  name: text().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
})

export const documents = pgTable("documents", {
  id: serial().primaryKey(),
  userId: integer().references(() => users.id),
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
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})
