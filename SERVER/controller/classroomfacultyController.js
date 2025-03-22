const ClassroomFaculty = require("../models/ClassroomFaculty");


// Add a new classroom-faculty association
const addClassroomFaculty = async (req, res) => {
    const { classroomId, division, faculty, max_students } = req.body;

 
    try {
        const existingEntry = await ClassroomFaculty.findOne({ classroomId, facultyId:faculty });
        if (existingEntry) {
            return res.status(400).json({ message: "Classroom faculty assignment already exists" });
        }
        
        const classroomFaculty = new ClassroomFaculty({ classroomId, division, facultyId:faculty, max_students });
        
        await classroomFaculty.save();
    

        res.status(201).json({ message: "Classroom faculty assigned successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Server Error: " + err });
    }
};


// Get ClassroomFaculty by ID
const getClassroomFacultyById = async (req, res) => {
    const classroomfacultyId = req.params.classroomfacultyId;


    try {
        const classroomFaculty = await ClassroomFaculty.findById(classroomfacultyId)
            .populate("classroomId")
            .populate("faculties");


        if (!classroomFaculty) {
            return res.status(404).json({ message: "ClassroomFaculty entry not found" });
        }


        res.json(classroomFaculty);
    }
    catch (err) {
        res.status(500).json({ message: "Server Error: " + err });
    }
};


// Get all ClassroomFaculty entries
const getAllClassroomFaculties = async (req, res) => {
    try {
        const classroomFaculties = await ClassroomFaculty.find()
            .populate("classroomId")
            .populate("faculties");


        res.json(classroomFaculties);
    }
    catch (err) {
        res.status(500).json({ message: "Server Error: " + err });
    }
};

const getClassroomsOfFaculty = async (req, res) => {
    try {
      const facultyId = req.user.id; // 🔥 Get logged-in faculty's ID from JWT
    //    console.log(facultyId);
        
      const classrooms = await ClassroomFaculty.find({ facultyId }) // Filter by faculty ID
        .populate("classroomId") // Get classroom details
        .select("-__v -createdAt -updatedAt"); // Exclude unnecessary fields
  
      if (!classrooms.length) {
        return res.status(404).json({ message: "No classrooms found for this faculty" });
      }
  
      res.json(classrooms);
    } catch (error) {
      res.status(500).json({ message: "Server Error: " + error.message });
    }
  };

// Update ClassroomFaculty entry
const updateClassroomFaculty = async (req, res) => {
    const classroomfacultyId = req.params.classroomfacultyId;
    const { classroomId, division, faculty, max_students } = req.body;


    try {
        
        const existingEntry = await ClassroomFaculty.findOne({ classroomId, faculty });
        if (existingEntry) {
            return res.status(400).json({ message: "Classroom faculty assignment already exists" });
        }

        const updatedClassroomFaculty = await ClassroomFaculty.findByIdAndUpdate(
            classroomfacultyId,
            { classroomId, division, faculties, max_students, updatedAt: Date.now() },
            { new: true }
        );


        if (!updatedClassroomFaculty) {
            return res.status(404).json({ message: "ClassroomFaculty entry not found" });
        }


        res.json({ message: "Classroom faculty updated successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Server Error: " + err });
    }
};


// Delete ClassroomFaculty entry
const deleteClassroomFacultyById = async (req, res) => {
    const classroomfacultyId = req.params.classroomfacultyId;


    try {
        const classroomFaculty = await ClassroomFaculty.findByIdAndDelete(classroomfacultyId);
        if (!classroomFaculty) {
            return res.status(404).json({ message: "ClassroomFaculty entry not found" });
        }


        res.json({ message: "Classroom faculty deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Server Error: " + err });
    }
};

const getFacultiesOfClassroom = async (req, res) => {
    const { classroomId } = req.params;
    
    try {
        const faculties = await ClassroomFaculty.find({ classroomId }).populate('facultyId');
        if (!faculties.length) {
            return res.status(404).json({ message: "No faculties found for this classroom" });
        }
        res.status(200).json({ faculties });
    } catch (err) {
        res.status(500).json({ message: "Server Error: " + err });
    }
};

const getFacultiesByClassroomId = async (req, res) => {
    const { classroomId } = req.params;

    try {
        // Find all faculty entries in ClassroomFaculty table for the given classroom
        const classroomFaculties = await ClassroomFaculty.find({ classroomId }).populate("facultyId");

        if (!classroomFaculties.length) {
            return res.status(404).json({ message: "No faculties found for this classroom" });
        }

        // Extract only faculty details
        const faculties = classroomFaculties.map((entry) => entry.facultyId);
        
        res.status(200).json({ faculties });
    } catch (err) {
        res.status(500).json({ message: "Server Error: " + err.message });
    }
};

module.exports = {
    addClassroomFaculty,
    getClassroomFacultyById,
    getAllClassroomFaculties,
    updateClassroomFaculty,
    deleteClassroomFacultyById,
    getFacultiesOfClassroom,
    getClassroomsOfFaculty,
    getFacultiesByClassroomId
};