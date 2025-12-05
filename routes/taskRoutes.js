const express = require("express");
const { authMiddleware } = require("../middlewares/auth");
const Task = require("../models/Task");
const Project = require("../models/Project");

const router = express.Router();

// Protect all routes
router.use(authMiddleware);

/**
 * Middleware: validate project ownership
 */
async function verifyOwnership(req, res, next) {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found!" });
    }

    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized!" });
    }

    req.project = project;
    next();

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * POST /api/projects/:projectId/tasks
 */
router.post("/projects/:projectId/tasks", verifyOwnership, async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      project: req.project._id,
    });

    res.status(201).json(task);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/projects/:projectId/tasks
 */
router.get("/projects/:projectId/tasks", verifyOwnership, async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.project._id });
    res.json(tasks);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * PUT /api/tasks/:taskId
 */
router.put("/tasks/:taskId", async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found!" });
    }

    const project = await Project.findById(task.project);

    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized!" });
    }

    const updated = await Task.findByIdAndUpdate(
      req.params.taskId,
      req.body,
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /api/tasks/:taskId
 */
router.delete("/tasks/:taskId", async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found!" });
    }

    const project = await Project.findById(task.project);

    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized!" });
    }

    await task.deleteOne();

    res.json({ message: "Task deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
