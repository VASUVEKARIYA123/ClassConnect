const Student = require("../models/Student");
const xlsx = require('xlsx');
const bcrypt = require("bcryptjs");
const ClassroomStudent = require("../models/ClassroomStudent");
const {format} =require("date-fns")

const importStudents = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Please upload an Excel file" });
        }

        // Read Excel file
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        // Convert sheet data to student objects
        const students = await Promise.all(sheetData.map(async (row) => {
            console.log(row.birthDate);
            
            const hashedPassword = await bcrypt.hash(row.birthDate.toString(), 10);
            return {
                studentId: row.studentId,
                firstname: row.firstname,
                lastname: row.lastname,
                birthDate: new Date(row.birthDate),
                password: hashedPassword,
            };
        }));
        
        // Insert into DB
        await Student.insertMany(students);

        res.status(201).json({ message: "Students imported successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Add a new student
const addStudent = async (req, res) => {
    // const { studentId, firstname, lastname, birthDate } = req.body;

    // console.log(birthDate);
    
    // try {
    //     // Check if student ID already exists
    //     const existingStudent = await Student.findOne({ studentId });
    //     if (existingStudent) {
    //         return res.status(400).json({ message: "Student ID already exists" });
    //     }
            // const bd = excelSerialToDate1(birthDate-1);
            // const hashedPassword = await bcrypt.hash(bd, 10);
            // console.log(birthDate);
            // console.log(hashedPassword);

        //     const verify = await bcrypt.compare(bd,hashedPassword);
        //     console.log(verify);
        
        // const student = new Student({ studentId, firstname, lastname, birthDate:bb ,password :hashedPassword});
        // await student.save();
        res.status(201).json({ message: "not implemented" });
    // }
    // catch (err) {
    //     res.status(500).json({ message: "Server Error: " + err });
    // }
};


// Get student by ID
const getStudentById = async (req, res) => {
    const studentId = req.params.studentId;


    try {
        const student = await Student.findOne({ studentId }).lean();
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }


        res.json(student);
    }
    catch (err) {
        res.status(500).json({ message: "Server Error: " + err });
    }
};


// Get all students
const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    }
    catch (err) {
        res.status(500).json({ message: "Server Error: " + err });
    }
};


// Update a student
const updateStudent = async (req, res) => {
    const studentId = req.params.studentId;
    const { firstname, lastname, birthDate } = req.body;


    try {
        // Check if another student already has the same studentId
        const existingStudent = await Student.findOne({ studentId });
        if (existingStudent && existingStudent._id.toString() !== req.params.id) {
            return res.status(400).json({ message: "Student ID already exists" });
        }


        const student = await Student.findOneAndUpdate(
            { studentId },
            { firstname, lastname, birthDate, updatedAt: Date.now() },
            { new: true }
        );


        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }


        res.json({ message: "Student updated successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Server Error: " + err });
    }
};


// Delete student by ID
const deleteStudentById = async (req, res) => {
    const studentId = req.params.studentId;


    try {
        const student = await Student.findOneAndDelete({ studentId });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }


        res.json({ message: "Student deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Server Error: " + err });
    }
};

function excelSerialToDate1(serial) {
    const excelEpoch = new Date(1900, 0, 1);
    const date = new Date(excelEpoch.getTime() + (serial - 1) * 86400000);
    
    // Formatting the date as DD-MM-YYYY
    const formattedDate = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });

    return formattedDate;
}

function excelSerialToDate2(serial) {
    const excelEpoch = new Date(1900, 0, 1); // Excel's base date (Jan 1, 1900)
    return new Date(excelEpoch.getTime() + (serial - 1) * 86400000);
}
  
const importStudentsWithClassroom = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Please upload an Excel file" });
        }

        const { classroomId } = req.body;
        if (!classroomId) {
            return res.status(400).json({ error: "Classroom ID is required" });
        }

        // ✅ Read Excel file
        const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        let addedStudents = 0;
        let alreadyPresentStudents = 0;
        let addedToClassroom = 0;
        let alreadyInClassroom = 0;

        for (const row of sheetData) {
            // 🔹 Check if student already exists
            let student = await Student.findOne({ studentId: row.studentId });
            console.log(excelSerialToDate2(row.birthDate-1));
            if (!student) {
                // 🔹 If student does not exist, create and insert into Student collection
                
                
                const hashedPassword = await bcrypt.hash(excelSerialToDate1(row.birthDate-1), 10);
                student = new Student({
                    studentId: row.studentId,
                    firstname: row.firstname,
                    lastname: row.lastname,
                    birthDate: excelSerialToDate2(row.birthDate),
                    password: hashedPassword,
                });

                await student.save();
                addedStudents++;
            } else {
                alreadyPresentStudents++;
            }

            // 🔹 Check if student is already in the classroom
            const existingClassroomStudent = await ClassroomStudent.findOne({
                classroomId,
                studentId: student._id, // Ensure correct ID reference
            });

            if (!existingClassroomStudent) {
                // 🔹 Add student to classroom only if not already added
                await ClassroomStudent.create({
                    classroomId,
                    studentId: student._id,
                    cpi: row.cpi || 0,  // ✅ Default value if missing
                    division: row.division || "A"  // ✅ Default division if missing
                });
                addedToClassroom++;
            } else {
                alreadyInClassroom++;
            }
        }

        res.status(201).json({
            message: "Students imported & added to classroom successfully!",
            summary: {
                newStudentsAdded: addedStudents,
                existingStudents: alreadyPresentStudents,
                addedToClassroom,
                alreadyInClassroom
            }
        });
    } catch (error) {
        console.error("Error importing students:", error);
        res.status(500).json({ error: "Server Error: " + error.message });
    }
};


module.exports = {
    addStudent,
    getStudentById,
    getAllStudents,
    updateStudent,
    deleteStudentById,
    importStudents,
    importStudentsWithClassroom
};