import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  grade: text("grade").notNull(),
  totalPoints: integer("total_points").default(0),
  streak: integer("streak").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  description: text("description"),
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  subjectId: integer("subject_id").notNull(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: json("content").notNull(), // Rich content structure
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced
  estimatedTime: integer("estimated_time"), // in minutes
  createdAt: timestamp("created_at").defaultNow(),
});

export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull(),
  type: text("type").notNull(), // qcm, classification, essay
  title: text("title").notNull(),
  content: json("content").notNull(), // Exercise specific data
  points: integer("points").default(10),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  subjectId: integer("subject_id").notNull(),
  courseId: integer("course_id"),
  progress: integer("progress").default(0), // percentage 0-100
  lastAccessedAt: timestamp("last_accessed_at").defaultNow(),
});

export const exerciseResults = pgTable("exercise_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  exerciseId: integer("exercise_id").notNull(),
  score: integer("score").notNull(),
  maxScore: integer("max_score").notNull(),
  completedAt: timestamp("completed_at").defaultNow(),
  answers: json("answers"), // User's answers
});

export const dailyStats = pgTable("daily_stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: text("date").notNull(), // YYYY-MM-DD format
  timeSpent: integer("time_spent").default(0), // in minutes
  exercisesCompleted: integer("exercises_completed").default(0),
  pointsEarned: integer("points_earned").default(0),
});

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  subjectId: integer("subject_id").notNull(),
  teacherName: text("teacher_name").notNull(),
  title: text("title").notNull(),
  scheduledAt: timestamp("scheduled_at").notNull(),
  type: text("type").notNull(), // video, chat
  status: text("status").default("scheduled"), // scheduled, completed, cancelled
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertSubjectSchema = createInsertSchema(subjects).omit({ id: true });
export const insertCourseSchema = createInsertSchema(courses).omit({ id: true, createdAt: true });
export const insertExerciseSchema = createInsertSchema(exercises).omit({ id: true, createdAt: true });
export const insertUserProgressSchema = createInsertSchema(userProgress).omit({ id: true, lastAccessedAt: true });
export const insertExerciseResultSchema = createInsertSchema(exerciseResults).omit({ id: true, completedAt: true });
export const insertDailyStatsSchema = createInsertSchema(dailyStats).omit({ id: true });
export const insertAppointmentSchema = createInsertSchema(appointments).omit({ id: true });

// Select types
export type User = typeof users.$inferSelect;
export type Subject = typeof subjects.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type Exercise = typeof exercises.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
export type ExerciseResult = typeof exerciseResults.$inferSelect;
export type DailyStats = typeof dailyStats.$inferSelect;
export type Appointment = typeof appointments.$inferSelect;

// Insert types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertSubject = z.infer<typeof insertSubjectSchema>;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type InsertExercise = z.infer<typeof insertExerciseSchema>;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type InsertExerciseResult = z.infer<typeof insertExerciseResultSchema>;
export type InsertDailyStats = z.infer<typeof insertDailyStatsSchema>;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
