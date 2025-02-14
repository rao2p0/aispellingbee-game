import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const puzzles = pgTable("puzzles", {
  id: serial("id").primaryKey(),
  letters: text("letters").notNull(),
  centerLetter: text("centerLetter").notNull(),
  validWords: text("validWords").array().notNull(),
  points: integer("points").notNull(),
});

export const insertPuzzleSchema = createInsertSchema(puzzles);
export type InsertPuzzle = z.infer<typeof insertPuzzleSchema>;
export type Puzzle = typeof puzzles.$inferSelect;

export const wordSubmissionSchema = z.object({
  word: z.string().min(4),
});

export type WordSubmission = z.infer<typeof wordSubmissionSchema>;
