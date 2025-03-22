const Classroom = require("../models/Classroom");


// Add a new classroom
const addClassroom = async (req, res) => {
    const { name, description, semester, criteria } = req.body;


    try {
        // Check if classroom with the same name already exists
        const existingClassroom = await Classroom.findOne({ name });
        if (existingClassroom) {
            return res.status(400).json({ message: "Classroom with the same name already exists" });
        }


        const classroom = new Classroom({ name, description, semester, criteriaId:criteria });
        await classroom.save();


        res.status(201).json({ message: "Classroom created successfully",classroom :classroom});
    }
    catch (err) {
        res.status(500).json({ message: "Server Error: " + err });
    }
};


// Get classroom by ID
const getClassroomById = async (req, res) => {
    const classroomId = req.params.classroomId;


    try {
        const classroom = await Classroom.findById(classroomId);
        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found" });
        }


        res.json(classroom);
    }
    catch (err) {
        res.status(500).json({ message: "Server Error: " + err });
    }
};


// Get all classrooms
const getAllClassrooms = async (req, res) => {
    try {
        const classrooms = await Classroom.find();
        res.json(classrooms);
    }
    catch (err) {
        res.status(500).json({ message: "Server Error: " + err });
    }
};


// Update classroom details
const updateClassroom = async (req, res) => {
    const classroomId = req.params.classroomId;
    const { name, description, semester, criteria, mode} = req.body;


    try {
        // Check if another classroom already has the same name
        const existingClassroom = await Classroom.findOne({ name });
        if (existingClassroom && existingClassroom._id.toString() !== classroomId) {
            return res.status(400).json({ message: "Classroom with the same name already exists" });
        }


        const classroom = await Classroom.findByIdAndUpdate(
            classroomId,
            { name, description, semester, criteria, mode,updatedAt: Date.now() },
            { new: true }
        );


        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found" });
        }


        res.json({ message: "Classroom updated successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Server Error: " + err });
    }
};


// Delete classroom by ID
const deleteClassroomById = async (req, res) => {
    const classroomId = req.params.classroomId;


    try {
        const classroom = await Classroom.findByIdAndDelete(classroomId);
        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found" });
        }


        res.json({ message: "Classroom deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Server Error: " + err });
    }
};


module.exports = {
    addClassroom,
    getClassroomById,
    getAllClassrooms,
    updateClassroom,
    deleteClassroomById
};