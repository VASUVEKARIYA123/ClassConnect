const LabTask = require("../models/LabTask");
const Classroom = require('../models/Classroom');
// Create a new Lab Task
const createLabTask = async (req, res) => {
  try {
    const { classroomId, facultiesId, labNumber, title, description, total_marks, due_date } = req.body;
   
    // Check if the classroom exists and its mode is "phase3"
    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }
   
    // if (classroom.mode !== "phase3") {
    //   return res.status(403).json({ message: "LabTask creation is not allowed. Classroom mode must be 'phase3'." });
    // }
    
    const newLabTask = new LabTask({
      classroomId,
      facultiesId,
      labNumber,
      title,
      description,
      total_marks,
      due_date,
    });
   
    const savedLabTask = await newLabTask.save();
    
    res.status(201).json(savedLabTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all Lab Tasks
const getAllLabTasks = async (req, res) => {
  try {
    const labTasks = await LabTask.find().populate("classroomId facultiesId");
    res.status(200).json(labTasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all Lab Tasks for a specific classroom
const getLabTasksOfClassroom = async (req, res) => {
  try {
    const { classroomId } = req.params;
    const labTasks = await LabTask.find({ classroomId }).populate("facultiesId");

    if (!labTasks.length) {
      return res.status(404).json({ message: "No Lab Tasks found for this classroom" });
    }

    res.status(200).json(labTasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single Lab Task by ID
const getLabTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const labTask = await LabTask.findById(id).populate("classroomId facultiesId");

    if (!labTask) {
      return res.status(404).json({ message: "Lab Task not found" });
    }

    res.status(200).json(labTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a Lab Task
const updateLabTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedLabTask = await LabTask.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedLabTask) {
      return res.status(404).json({ message: "Lab Task not found" });
    }

    res.status(200).json(updatedLabTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a Lab Task
const deleteLabTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLabTask = await LabTask.findByIdAndDelete(id);

    if (!deletedLabTask) {
      return res.status(404).json({ message: "Lab Task not found" });
    }

    res.status(200).json({ message: "Lab Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createLabTask,
  getAllLabTasks,
  getLabTasksOfClassroom,
  getLabTaskById,
  updateLabTask,
  deleteLabTask
};