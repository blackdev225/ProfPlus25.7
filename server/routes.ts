import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertExerciseResultSchema, 
  insertDailyStatsSchema,
  type ExerciseResult 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get current user (for demo, always return user 1)
  app.get("/api/user", async (req, res) => {
    try {
      const user = await storage.getUser(1);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  // Get all subjects
  app.get("/api/subjects", async (req, res) => {
    try {
      const subjects = await storage.getAllSubjects();
      res.json(subjects);
    } catch (error) {
      res.status(500).json({ error: "Failed to get subjects" });
    }
  });

  // Get user progress for all subjects
  app.get("/api/user/:userId/progress", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const progress = await storage.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Failed to get user progress" });
    }
  });

  // Get daily stats
  app.get("/api/user/:userId/stats/:date", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const date = req.params.date;
      const stats = await storage.getDailyStats(userId, date);
      
      if (!stats) {
        // Return default stats if none exist
        res.json({
          timeSpent: 0,
          exercisesCompleted: 0,
          pointsEarned: 0
        });
      } else {
        res.json(stats);
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to get daily stats" });
    }
  });

  // Get user appointments
  app.get("/api/user/:userId/appointments", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const appointments = await storage.getUserAppointments(userId);
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: "Failed to get appointments" });
    }
  });

  // Get course by slug
  app.get("/api/courses/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const course = await storage.getCourseBySlug(slug);
      
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
      
      res.json(course);
    } catch (error) {
      res.status(500).json({ error: "Failed to get course" });
    }
  });

  // Get exercises for a course
  app.get("/api/courses/:courseId/exercises", async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const exercises = await storage.getExercisesByCourse(courseId);
      res.json(exercises);
    } catch (error) {
      res.status(500).json({ error: "Failed to get exercises" });
    }
  });

  // Submit exercise result
  app.post("/api/exercises/:exerciseId/submit", async (req, res) => {
    try {
      const exerciseId = parseInt(req.params.exerciseId);
      const resultData = insertExerciseResultSchema.parse({
        ...req.body,
        exerciseId
      });

      const result = await storage.createExerciseResult(resultData);
      
      // Update daily stats
      const today = new Date().toISOString().split('T')[0];
      const currentStats = await storage.getDailyStats(resultData.userId, today);
      
      await storage.updateDailyStats(resultData.userId, today, {
        exercisesCompleted: (currentStats?.exercisesCompleted || 0) + 1,
        pointsEarned: (currentStats?.pointsEarned || 0) + resultData.score
      });

      // Update user total points
      const user = await storage.getUser(resultData.userId);
      if (user) {
        await storage.updateUser(resultData.userId, {
          totalPoints: (user.totalPoints || 0) + resultData.score
        });
      }

      res.json(result);
    } catch (error) {
      console.error("Error submitting exercise result:", error);
      res.status(500).json({ error: "Failed to submit exercise result" });
    }
  });

  // Get exercise result for user
  app.get("/api/user/:userId/exercises/:exerciseId/result", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const exerciseId = parseInt(req.params.exerciseId);
      
      const result = await storage.getExerciseResult(userId, exerciseId);
      if (!result) {
        return res.status(404).json({ error: "Result not found" });
      }
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to get exercise result" });
    }
  });

  // Update user progress
  app.post("/api/user/:userId/progress", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { subjectId, courseId, progress } = req.body;
      
      const updatedProgress = await storage.updateUserProgress(userId, subjectId, courseId, progress);
      res.json(updatedProgress);
    } catch (error) {
      res.status(500).json({ error: "Failed to update progress" });
    }
  });

  // Get recent activity (exercise results)
  app.get("/api/user/:userId/activity", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const results = await storage.getUserExerciseResults(userId);
      
      // Sort by completion date, most recent first
      const recentResults = results
        .sort((a, b) => b.completedAt!.getTime() - a.completedAt!.getTime())
        .slice(0, 10); // Get last 10 activities
      
      res.json(recentResults);
    } catch (error) {
      res.status(500).json({ error: "Failed to get user activity" });
    }
  });

  // Update user profile
  app.patch("/api/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const updates = req.body;
      
      const updatedUser = await storage.updateUser(userId, updates);
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
