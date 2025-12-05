const express = require("express");
const { authMiddleware } = require("../middlewares/auth");
const Project = require("../models/Project");

const projectRouter = express.Router();

// ===================== CREATE PROJECT =====================
projectRouter.post("/", authMiddleware, async (req, res) => {
    try {
        const project = await Project.create({
            name: req.body.name,
            description: req.body.description,
            user: req.user._id, // owner from JWT
        });

        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ===================== GET ALL PROJECTS =====================
projectRouter.get("/", authMiddleware, async (req, res) => {
    try {
        const projects = await Project.find({ user: req.user._id });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ===================== GET SINGLE PROJECT =====================
projectRouter.get("/:projectId", authMiddleware, async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);

        if (!project) return res.status(404).json({ message: "Project not found" });

        // Ownership check
        if (project.user.toString() !== req.user._id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ===================== UPDATE PROJECT =====================
projectRouter.put("/:projectId", authMiddleware, async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);

        if (!project) return res.status(404).json({ message: "Project not found" });

        // Ownership check
        if (project.user.toString() !== req.user._id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        // Update project
        const updatedProject = await Project.findByIdAndUpdate(
            req.params.projectId,
            req.body,
            { new: true }
        );

        res.json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ===================== DELETE PROJECT =====================
projectRouter.delete("/:projectId", authMiddleware, async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);

        if (!project) return res.status(404).json({ message: "Project not found" });

        // Ownership check
        if (project.user.toString() !== req.user._id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await project.deleteOne();
        res.json({ message: "Project deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = projectRouter;
