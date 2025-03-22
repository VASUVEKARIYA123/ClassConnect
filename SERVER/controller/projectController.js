const Project = require("../models/Project");


// Add a new project
const addProject = async (req, res) => {
    const { domain, defination, max_groups } = req.body;


    try {
        // Check if project with the same definition already exists
        const existingProject = await Project.findOne({ defination });
        if (existingProject) {
            return res.status(400).json({ message: "Project with the same definition already exists" });
        }


        const project = new Project({ domain, defination, max_groups });
        await project.save();


        res.status(201).json({ message: "Project created successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Server Error: " + err });
    }
};


// Get project by ID
const getProjectById = async (req, res) => {
    const projectId = req.params.projectId;


    try {
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }


        res.json(project);
    }
    catch (err) {
        res.status(500).json({ message: "Server Error: " + err });
    }
};


// Get all projects
const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    }
    catch (err) {
        res.status(500).json({ message: "Server Error: " + err });
    }
};


// Update project details
const updateProject = async (req, res) => {
    const projectId = req.params.projectId;
    const { domain, defination, max_groups } = req.body;


    try {
        // Check if another project already has the same definition
        const existingProject = await Project.findOne({ defination });
        if (existingProject && existingProject._id.toString() !== projectId) {
            return res.status(400).json({ message: "Project with the same definition already exists" });
        }


        const project = await Project.findByIdAndUpdate(
            projectId,
            { domain, defination, max_groups, updatedAt: Date.now() },
            { new: true }
        );


        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }


        res.json({ message: "Project updated successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Server Error: " + err });
    }
};


// Delete project by ID
const deleteProjectById = async (req, res) => {
    const projectId = req.params.projectId;


    try {
        const project = await Project.findByIdAndDelete(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }


        res.json({ message: "Project deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Server Error: " + err });
    }
};


module.exports = {
    addProject,
    getProjectById,
    getAllProjects,
    updateProject,
    deleteProjectById
};