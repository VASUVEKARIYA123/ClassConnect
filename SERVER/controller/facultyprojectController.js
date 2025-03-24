const FacultyProject = require("../models/FacultyProject");


// Add Faculty-Project Association
const addFacultyProject = async (req, res) => {
    const { facultyId, projectId, classroomId } = req.body;

    try {
        // Check if the same faculty-project-classroom combination already exists
        const existingEntry = await FacultyProject.findOne({ facultyId, projectId, classroomId })
            .populate("facultyId", "firstname lastname email") // Populate faculty details
            .populate("projectId", "domain defination max_groups") // Populate project details
            .populate("classroomId", "name description semester"); // Populate classroom details

        if (existingEntry) {
            return res.status(400).json({ message: "This faculty-project-classroom combination already exists", existingEntry });
        }

        // Create new faculty-project entry
        const facultyProject = new FacultyProject({ facultyId, projectId, classroomId });
        await facultyProject.save();

        // Populate faculty, project, and classroom in the response
        const populatedFacultyProject = await FacultyProject.findById(facultyProject._id)
            .populate("facultyId")
            .populate("projectId")
            .populate("classroomId");

        res.status(201).json({ message: "Faculty-Project assigned successfully", facultyProject: populatedFacultyProject });
    } catch (err) {
        res.status(500).json({ message: "Server Error: " + err });
    }
};



// Get all Faculty-Project Assignments
const getAllFacultyProjects = async (req, res) => {
    try {
        const facultyProjects = await FacultyProject.find()
            .populate("facultyId")
            .populate("projectId")
            .populate("classroomId");


        res.json(facultyProjects);
    }
    catch (err) {
        res.status(500).json({ message: "Server Error: " + err });
    }
};


// Get Faculty-Project by ID
const getFacultyProjectById = async (req, res) => {
    const facultyProjectId = req.params.facultyProjectId;


    try {
        const facultyProject = await FacultyProject.findById(facultyProjectId)
            .populate("facultyId")
            .populate("projectId")
            .populate("classroomId");


        if (!facultyProject) {
            return res.status(404).json({ message: "Faculty-Project not found" });
        }


        res.json(facultyProject);
    }
    catch (err) {
        res.status(500).json({ message: "Server Error: " + err });
    }
};


// Prevent Count Update
const updateFacultyProject = async (req, res) => {
    const facultyProjectId = req.params.facultyProjectId;
    const { facultyId, projectId, classroomId, count } = req.body;


    try {
        // Prevent updating 'count'
        if (count !== undefined) {
            return res.status(400).json({ message: "Count cannot be updated" });
        }


        // Ensure uniqueness
        const existingEntry = await FacultyProject.findOne({ facultyId, projectId, classroomId });
        if (existingEntry && existingEntry._id.toString() !== facultyProjectId) {
            return res.status(400).json({ message: "This faculty-project-classroom combination already exists" });
        }


        const updatedFacultyProject = await FacultyProject.findByIdAndUpdate(
            facultyProjectId,
            { facultyId, projectId, classroomId },
            { new: true }
        );


        if (!updatedFacultyProject) {
            return res.status(404).json({ message: "Faculty-Project not found" });
        }


        res.json({ message: "Faculty-Project updated successfully", updatedFacultyProject });
    }
    catch (err) {
        res.status(500).json({ message: "Server Error: " + err });
    }
};


// Delete Faculty-Project (Prevent if count > 1)
const deleteFacultyProject = async (req, res) => {
    const facultyProjectId = req.params.facultyProjectId;


    try {
        const facultyProject = await FacultyProject.findById(facultyProjectId);


        if (!facultyProject) {
            return res.status(404).json({ message: "Faculty-Project not found" });
        }


        // Prevent deletion if count > 1
        if (facultyProject.count > 1) {
            return res.status(400).json({ message: "Cannot delete Faculty-Project as it has been selected by students" });
        }


        await FacultyProject.findByIdAndDelete(facultyProjectId);
        res.json({ message: "Faculty-Project deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Server Error: " + err });
    }
};


const projectGroupCount = async (req, res) => {
    try {
        const { classroomId, projectId } = req.params; // Extract from request params

        if (!classroomId || !projectId) {
            return res.status(400).json({ message: "classroomId and projectId are required" });
        }

        const count = await FacultyProject.countDocuments({ classroomId, projectId });

        res.status(200).json({ count });
    } catch (error) {
        console.error('Error counting entries:', error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const getFacultyProjectsByClassroomAndFacId = async (req, res) => {
    const { facultyId, classroomId } = req.params; // Get facultyId & classroomId from URL

    try {
        const facultyProjects = await FacultyProject.find({ facultyId, classroomId })
            .populate("projectId") // Optional: Populate project details
            .populate("facultyId", "firstname lastname") // Optional: Populate faculty details

        if (!facultyProjects || facultyProjects.length === 0) {
            return res.status(404).json({ message: "No faculty projects found for the given criteria" });
        }

        res.json(facultyProjects);
    } catch (error) {
        res.status(500).json({ message: "Server Error: " + error.message });
    }
};


const getFacultyProjects = async (req, res) => {
    try {
        const { classroomId, facultyId } = req.params;

        if (!classroomId || !facultyId) {
            return res.status(400).json({ error: "Classroom ID and Faculty ID are required" });
        }

        // Fetch faculty projects matching both classroomId and facultyId
        const facultyProjects = await FacultyProject.find({ classroomId, facultyId }).select('_id');

        if (!facultyProjects.length) {
            return res.status(200).json({ facultyProjectIds: [] }); // Return an empty array if no projects found
        }

        res.status(200).json(facultyProjects.map(fp => ({ _id: fp._id }))); // Return as an array of objects
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getFacultyProjects };


module.exports = {
    addFacultyProject,
    getAllFacultyProjects,
    getFacultyProjectById,
    updateFacultyProject,
    deleteFacultyProject,
    projectGroupCount,
    getFacultyProjectsByClassroomAndFacId,
    getFacultyProjects
};