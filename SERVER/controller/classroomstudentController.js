const ClassroomStudent = require("../models/ClassroomStudent");


// Add a student to a classroom
const addClassroomStudent = async (req, res) => {
    const { classroomId, studentId, division, cpi } = req.body;


    try {
        // Validate that CPI is between 0 and 10
        if (cpi < 0 || cpi > 10) {
            return res.status(400).json({ message: "CPI must be between 0 and 10" });
        }


        // Check if the student is already assigned to this classroom
        const existingEntry = await ClassroomStudent.findOne({ classroomId, studentId });
        if (existingEntry) {
            return res.status(400).json({ message: "Student is already assigned to this classroom" });
        }


        const classroomStudent = new ClassroomStudent({ classroomId, studentId, division, cpi });
        await classroomStudent.save();


        res.status(201).json({ message: "Student assigned to classroom successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Server Error: " + err });
    }
};


// Get a specific ClassroomStudent entry by ID
const getClassroomStudentById = async (req, res) => {
    const classroomstudentId = req.params.classroomstudentId;


    try {
        const classroomStudent = await ClassroomStudent.findById(classroomstudentId)
            .populate("classroomId")
            .populate("studentId");


        if (!classroomStudent) {
            return res.status(404).json({ message: "ClassroomStudent entry not found" });
        }


        res.json(classroomStudent);
    }
    catch (err) {
        res.status(500).json({ message: "Server Error: " + err });
    }
};


// Get all ClassroomStudent entries
const getAllClassroomStudents = async (req, res) => {
    try {
        const classroomStudents = await ClassroomStudent.find()
            .populate("classroomId")
            .populate("studentId");


        res.json(classroomStudents);
    }
    catch (err) {
        res.status(500).json({ message: "Server Error: " + err });
    }
};


// Update a ClassroomStudent entry
const updateClassroomStudent = async (req, res) => {
    const classroomstudentId = req.params.classroomstudentId;
    const { classroomId, studentId, division, cpi } = req.body;


    try {
        // Validate CPI range
        if (cpi < 0 || cpi > 10) {
            return res.status(400).json({ message: "CPI must be between 0 and 10" });
        }


        // Ensure student-classroom uniqueness
        const existingEntry = await ClassroomStudent.findOne({ classroomId, studentId });
        if (existingEntry && existingEntry._id.toString() !== classroomstudentId) {
            return res.status(400).json({ message: "Student is already assigned to this classroom" });
        }


        const updatedClassroomStudent = await ClassroomStudent.findByIdAndUpdate(
            classroomstudentId,
            { classroomId, studentId, division, cpi, updatedAt: Date.now() },
            { new: true }
        );


        if (!updatedClassroomStudent) {
            return res.status(404).json({ message: "ClassroomStudent entry not found" });
        }


        res.json({ message: "Classroom student updated successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Server Error: " + err });
    }
};


// Delete a ClassroomStudent entry
const deleteClassroomStudentById = async (req, res) => {
    const classroomstudentId = req.params.classroomstudentId;
    // console.log(classroomstudentId);
    

    try {
        const classroomStudent = await ClassroomStudent.findByIdAndDelete(classroomstudentId);
        
        if (!classroomStudent) {
            
            return res.status(404).json({ message: "ClassroomStudent entry not found" });
        }


        res.json({ message: "Classroom student removed successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Server Error: " + err });
    }
};

const getStudentsByClassroomId = async (req, res) => {
    const { classroomId } = req.params;

    
    try {
        // Find all student entries in ClassroomStudent table for given classroom
        
        const classroomStudents = await ClassroomStudent.find({ classroomId }).populate("studentId");
        
        if (!classroomStudents.length) {
            return res.status(200).json({ message: "No students found for this classroom" });
        }

        // Extract only student details
        const students = classroomStudents.map((entry) => entry.studentId);
        
        
        
        res.status(200).json({ students });
    } catch (err) {
        res.status(500).json({ message: "Server Error: " + err.message });
    }
};

const getClassroomsOfStudent = async (req, res) => {
    try {
        const studentId = req.user.id; // 🔥 Get logged-in student's ID from JWT
        // console.log(studentId);
        
        const classrooms = await ClassroomStudent.find({ studentId }) // Filter by student ID
            .populate("classroomId") // Get classroom details
            .select("-__v -createdAt -updatedAt"); // Exclude unnecessary fields

        if (!classrooms.length) {
            return res.status(404).json({ message: "No classrooms found for this student" });
        }

        res.json(classrooms);
    } catch (error) {
        res.status(500).json({ message: "Server Error: " + error.message });
    }
};

const getClassroomStudentsByClassroomId = async (req, res) => {
    const { classroomId } = req.params;
    // console.log("HI");
    
    
    try {
        // Find all student entries in ClassroomStudent table for given classroom
        
        const classroomStudents = await ClassroomStudent.find({ classroomId }).populate("studentId");
        
        if (!classroomStudents.length) {
            return res.status(404).json({ message: "No students found for this classroom" });
        }

      const len=classroomStudents.length
       
        
        
        
        res.status(200).json({ classroomStudents, noofcs:len });
    } catch (err) {
        res.status(500).json({ message: "Server Error: " + err.message });
    }
};


module.exports = {
    addClassroomStudent,
    getClassroomStudentById,
    getAllClassroomStudents,
    updateClassroomStudent,
    deleteClassroomStudentById,
    getStudentsByClassroomId,
    getClassroomsOfStudent,
    getClassroomStudentsByClassroomId
};