const Project = require("../models/Project");
const multer = require("multer");
const xlsx = require("xlsx");

// Add a new project
const addProject = async (req, res) => {
    const { domain, defination, max_groups } = req.body;


    try {
        // Check if project with the same definition already exists
        const existingProject = await Project.findOne({ defination });
        if (existingProject) {
            return res.status(400).json({ message: "Project with the same definition already exists" });
        }

        const lastProject = await Project.findOne().sort('-number');
        const number = lastProject ? lastProject.number + 1 : 1;

        const project = new Project({number, domain, defination, max_groups });
        await project.save();


        res.status(201).json({ message: "Project created successfully", project });
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

const importProjects = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Please upload an Excel file" });
        }

        // Read the uploaded file
        const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        // Check if data is present
        if (!data || data.length === 0) {
            return res.status(400).json({ message: "Excel file is empty or invalid format" });
        }

        let addedProjects = 0;
        let skippedProjects = 0;
        const lastProject = await Project.findOne().sort('-number');
        let number = lastProject ? lastProject.number + 1 : 1;
        for (const row of data) {
            const domain = row.domain || "Unknown";
            const defination = row.defination || "No definition provided";
            const max_groups = row.max_groups || 8;
            
            if(domain === "Unknown" || defination === "No definition provided"){
                skippedProjects++;
                continue;
            }

            // Check if the project already exists
            const existingProject = await Project.findOne({ domain, defination });

            if (!existingProject) {
                // If not found, add the new project
                await Project.create({ number, domain, defination, max_groups });
                number++;
                addedProjects++;
            } else {
                // If found, skip adding
                skippedProjects++;
            }
        }

        res.status(201).json({
            message: "Project import completed",
            added: addedProjects,
            skipped: skippedProjects,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error: " + error.message });
    }
};

module.exports = {
    addProject,
    getProjectById,
    getAllProjects,
    updateProject,
    deleteProjectById,
    importProjects, 
};