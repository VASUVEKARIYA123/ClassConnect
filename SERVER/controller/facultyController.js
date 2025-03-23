const Faculty = require("../models/Faculty");
const bcrypt = require("bcryptjs");
const xlsx = require('xlsx');
const ClassroomFaculty = require("../models/ClassroomFaculty");
// Add a new faculty member
const addFaculty = async (req, res) => {
    const { firstname, lastname, email, password, role, rating, domain } = req.body;


    try {
        // Check if faculty with the same email already exists
        const existingFaculty = await Faculty.findOne({ email });
        if (existingFaculty) {
            return res.status(400).json({ message: "Email already exists" });
        }


        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);


        const faculty = new Faculty({ firstname, lastname, email, password: hashedPassword, role, rating, domain });
        await faculty.save();


        res.status(201).json({ message: "Faculty created successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Server Error: " + err });
    }
};


// Get faculty by ID
const getFacultyById = async (req, res) => {
    const facultyId = req.params.facultyId;


    try {
        const faculty = await Faculty.findById(facultyId).lean();
        if (!faculty) {
            return res.status(404).json({ message: "Faculty not found" });
        }


        delete faculty.password; // Remove password from response
        res.json(faculty);
    }
    catch (err) {
        res.status(500).json({ message: "Server Error: " + err });
    }
};


// Get all faculty members
const getAllFaculties = async (req, res) => {
    try {
        const faculties = await Faculty.find().select("-password"); // Exclude password
        res.json(faculties);
    }
    catch (err) {
        res.status(500).json({ message: "Server Error: " + err });
    }
};


// Update faculty details
const updateFacultybyadmin = async (req, res) => {
    const facultyId = req.params.facultyId;
    const { firstname, lastname, email, role, rating, domain } = req.body;


    try {
        // Check if another faculty already has the same email
        const existingFaculty = await Faculty.findOne({ email });
        if (existingFaculty && existingFaculty._id.toString() !== facultyId) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const faculty = await Faculty.findByIdAndUpdate(
            facultyId,
            { firstname, lastname, email, role, rating, domain, updatedAt: Date.now() },
            { new: true }
        );


        if (!faculty) {
            return res.status(404).json({ message: "Faculty not found" });
        }


        res.json({ message: "Faculty updated successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Server Error: " + err });
    }
};

const updateFacultybyfaculty = async (req, res) => {
    const facultyId = req.params.facultyId;
    const { firstname, lastname, email, domain } = req.body;

    try {
        // Check if another faculty already has the same email
        const existingFaculty = await Faculty.findOne({ email });
        if (existingFaculty && existingFaculty._id.toString() !== facultyId) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const faculty = await Faculty.findByIdAndUpdate(
            facultyId,
            { firstname, lastname, email, domain, updatedAt: Date.now() },
            { new: true }
        );

        if (!faculty) {
            return res.status(404).json({ message: "Faculty not found" });
        }

        res.json({ message: "Faculty details updated successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Server Error: " + err });
    }
};

// Delete faculty by ID
const deleteFacultyById = async (req, res) => {
    const facultyId = req.params.facultyId;


    try {
        const faculty = await Faculty.findByIdAndDelete(facultyId);
        if (!faculty) {
            return res.status(404).json({ message: "Faculty not found" });
        }


        res.json({ message: "Faculty deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Server Error: " + err });
    }
};

// Change faculty role to admin
const changeRoleTosubAdmin = async (req, res) => {
    try {
        const { facultyId } = req.params;

        // Count existing sub-admins
        const subAdminCount = await Faculty.countDocuments({ role: "subadmin" });

        if (subAdminCount >= 2) {
            return res.status(400).json({ message: "Cannot assign more than 2 sub-admins." });
        }

        const faculty = await Faculty.findById(facultyId);
        if (!faculty) {
            return res.status(404).json({ message: "Faculty not found" });
        }

        faculty.role = "subadmin";
        await faculty.save();

        res.json({ message: "Faculty role updated to subadmin successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server Error: " + err.message });
    }
};

const changeRoleToTeacher = async (req, res) => {
    const facultyId = req.params.facultyId;

    try {
        const faculty = await Faculty.findById(facultyId);
        if (!faculty) {
            return res.status(404).json({ message: "Faculty not found" });
        }

        faculty.role = "teacher";
        await faculty.save();

        res.json({ message: "Faculty role updated to teacher successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server Error: " + err });
    }
};

// Update faculty rating
const updateRating = async (req, res) => {
    const facultyId = req.params.facultyId;
    const { rating } = req.body;

    try {
        const faculty = await Faculty.findByIdAndUpdate(
            facultyId,
            { rating },
            { new: true }
        );

        if (!faculty) {
            return res.status(404).json({ message: "Faculty not found" });
        }

        res.json({ message: "Faculty rating updated successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Server Error: " + err });
    }
};

const importFacultiesWithClassroom = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Please upload an Excel file" });
        }

        const { classroomId } = req.body;
        // console.log(classroomId);
        
        if (!classroomId) {
            return res.status(400).json({ error: "Classroom ID is required" });
        }

        // ✅ Read Excel file
        const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        let addedFaculties = 0;
        let alreadyPresentFaculties = 0;
        let addedToClassroom = 0;
        let alreadyInClassroom = 0;

        for (const row of sheetData) {
            // 🔹 Check if student already exists
            let faculty = await Faculty.findOne({ email: row.email });

            if (!faculty) {
                // 🔹 If student does not exist, create and insert into Student collection
                const hashedPassword = await bcrypt.hash(row.password.toString(), 10);
                faculty = new Faculty({
                    firstname: row.firstname,
                    lastname: row.lastname,
                    email:row.email,
                    password: hashedPassword,
                });

                await faculty.save();
                console.log(faculty._id);
                
                addedFaculties++;
            } else {
                alreadyPresentFaculties++;
            }
            
            // 🔹 Check if student is already in the classroom
            const existingClassroomFaculty = await ClassroomFaculty.findOne({
                classroomId,
                facultyId: faculty._id, // Ensure correct ID reference
                division:"A"
            });
            
            if (!existingClassroomFaculty) {
                // 🔹 Add student to classroom only if not already added
                await ClassroomFaculty.create({
                    classroomId,
                    facultyId: faculty._id,
                    division: "A"  // ✅ Default division if missing
                });
                addedToClassroom++;
            } else {
                alreadyInClassroom++;
            }
        }

        res.status(201).json({
            message: "Faculties imported & added to classroom successfully!",
            summary: {
                newFacultiesAdded: addedFaculties,
                existingFaculties: alreadyPresentFaculties,
                addedToClassroom,
                alreadyInClassroom
            }
        });
    } catch (error) {
        console.error("Error importing faculties:", error);
        res.status(500).json({ error: "Server Error: " + error.message });
    }
};

const importFaculties = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Please upload an Excel file" });
        }

        // Read Excel file
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        // Convert sheet data to faculty objects
        const faculties = await Promise.all(sheetData.map(async (row) => {
            const hashedPassword = await bcrypt.hash(row.password, 10);
            return {
                firstname: row.firstname,
                lastname: row.lastname,
                email: row.email,
                password: hashedPassword,
                role: row.role || "teacher",  // Default role is "teacher" if not specified
            };
        }));

        // Insert into DB
        await Faculty.insertMany(faculties);

        res.status(201).json({ message: "Faculties imported successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    addFaculty,
    getFacultyById,
    getAllFaculties,
    updateFacultybyadmin,
    updateFacultybyfaculty,
    deleteFacultyById,
    changeRoleTosubAdmin,
    changeRoleToTeacher,
    updateRating,
    importFacultiesWithClassroom,
    importFaculties
};
