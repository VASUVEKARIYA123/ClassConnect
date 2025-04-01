const Group = require('../models/Group');
const Criteria = require('../models/Criteria');
const Student = require('../models/Student');
const ClassroomStudent = require('../models/ClassroomStudent');
const FacultyProject = require('../models/FacultyProject');
const Classroom = require('../models/Classroom');
const mongoose = require('mongoose');
const crypto = require('crypto'); // For secure random group code generation


const findMatchingStudents = async (req, res) => {
    try {
        const { classroomId, studentId } = req.params; // Extract classroomId and studentId from req.params


        // Validate inputs
        if (!classroomId || !studentId) {
            return res.status(400).json({ error: "Classroom ID and Student ID are required" });
        }

        const classroom=await Classroom.findById(classroomId)
        console.log(classroom);
        
        const criteriaId=classroom.criteriaId
        console.log(criteriaId);
        
        // Fetch criteria for the classroom
        const criteria = await Criteria.findById(criteriaId)
        if (!criteria) {
            return res.status(400).json({ error: "Criteria not found for this classroom" });
        }


        // Get the student details
        const student = await ClassroomStudent.findOne({ studentId, classroomId });
        if (!student) {
            return res.status(404).json({ error: "Student not found in this classroom" });
        }


        // Find students that match the criteria
        const matchingStudents = await ClassroomStudent.find({
            classroomId,
            studentId: { $ne: studentId }, // Exclude the current student
            cpi: { $gte: student.cpi - criteria.cpi, $lte: student.cpi + criteria.cpi }, // Match CPI range
            ...(criteria.division === false ? { division: student.division } : {}) // Match division if required
        }).populate('studentId'); // Populate student details


        res.status(200).json({ matchingStudents });


    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const changemode = async (req, res) => {
    const { groupId } = req.params;


    if (!groupId) {
        return res.status(400).json({ error: "Group ID is required" });
    }


    const group = await Group.findById(groupId).populate("students"); // Populate student details
    if (!group) {
        return res.status(404).json({ error: "group not exists" });
    }


    if (group.mode === "phase2") {
        return res.status(400).json({ error: "group has been already confirmed." });
    }
   
    const classroom = await Classroom.findById(group.classroomId).populate('criteriaId');
    if (!classroom) {
        return res.status(404).json({ error: 'Classroom not found' });
    }


    // Fetch classroom's group size and rules criteria
    const criteria = classroom.criteriaId;
    if (!criteria) {
        return res.status(400).json({ error: "Group criteria not found for this classroom" });
    }


    if (group.students.length < criteria.min_group_size) {
        return res.status(400).json({ error: "Group not match min group size" });
    }


    group.mode = "phase2";
    await group.save();


    res.status(200).json({
        message: "Successfully change the mode",
        group: {
            _id: group._id,
            name: group.name,
            number: group.number,
            students: group.students,
            groupCode: group.groupCode,
            classroomId: group.classroomId,
            facultyprojectId: group.facultyprojectId
        }
    });


}
const joinGroupByCode = async (req, res) => {
    try {
        const { groupCode, studentId } = req.params; // Extract groupCode and studentId from URL params


        // Validate input
        if (!groupCode || !studentId) {
            return res.status(400).json({ error: "Group Code and Student ID are required" });
        }


        // Check if student exists
        // console.log(studentId);
       
        const student = await ClassroomStudent.findOne({studentId : studentId});
        if (!student) {
            // console.log("student not found");
            return res.status(404).json({ error: "Student not found" });
        }
        // console.log(student);
        // Find the group using the provided group code
        const group = await Group.findOne({ groupCode }).populate("students"); // Populate student details
        if (!group) {
            return res.status(404).json({ error: "Invalid group code" });
        }


        if (group.mode === "phase2") {
            return res.status(400).json({ error: "that has already confirm their group." });
        }
        // Check if the student is already in a group within the same classroom
        const existingGroup = await Group.findOne({ classroomId: group.classroomId, students: studentId });
        if (existingGroup) {
            return res.status(400).json({ error: "You are already part of a group in this classroom" });
        }


        // Check if classroom exists
        const classroom = await Classroom.findById(group.classroomId).populate('criteriaId');
        if (!classroom) {
            return res.status(404).json({ error: 'Classroom not found' });
        }


        // Fetch classroom's group size and rules criteria
        const criteria = classroom.criteriaId;
        if (!criteria) {
            return res.status(400).json({ error: "Group criteria not found for this classroom" });
        }


        // Check if the group has reached the max limit
       


        // Check CPI difference between new student and existing group members
        const studentCPI = student.cpi; // Assuming student schema has a "cpi" field
        for (let existingStudent of group.students) {
            const existingStudentData = await ClassroomStudent.findOne({ studentId: existingStudent });
            // console.log(existingStudentData);
            if (Math.abs(existingStudentData.cpi - studentCPI) > criteria.cpi) {
                // console.log("CPI difference exceeds allowed limit");
                return res.status(400).json({ error: `CPI difference exceeds allowed limit (${criteria.cpi})` });
            }
        }
        if (group.students.length >= criteria.max_group_size) {
            // console.log("Group is already full");
            return res.status(400).json({ error: "Group is already full" });
        }


        // Check division rule
        if (!criteria.division) {
            const groupDivisions = new Set();


            for (let existingStudent of group.students) {
                const existingStudentData = await ClassroomStudent.findOne({ studentId: existingStudent });


                if (!existingStudentData) {
                    return res.status(400).json({ error: "Existing student data not found" });
                }


                groupDivisions.add(existingStudentData.division);
            }
            console.log(groupDivisions);
           
            if (!groupDivisions.has(student.division)) {
                return res.status(400).json({ error: "Students from different divisions cannot be in the same group" });
            }
        }




        // Add the student to the group
        group.students.push(studentId);
        await group.save();


        res.status(200).json({
            message: "Successfully joined the group",
            group: {
                _id: group._id,
                name: group.name,
                number: group.number,
                students: group.students,
                groupCode: group.groupCode,
                classroomId: group.classroomId,
                facultyprojectId: group.facultyprojectId
            }
        });


    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const selectProjectDefinition = async (req, res) => {
    try {
        const { groupId, facultyProjectId } = req.params;

        // Validate required fields
        if (!groupId || !facultyProjectId) {
            return res.status(400).json({ error: "Group ID and Faculty Project ID are required" });
        }

        // Check if the group exists
        const group = await Group.findById(groupId).populate('facultyprojectId');
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        // Check if the facultyProject exists
        const facultyProject = await FacultyProject.findById(facultyProjectId)
            .populate('facultyId')  // Populating faculty details
            .populate('projectId');  // Populating project details

        if (!facultyProject) {
            return res.status(404).json({ error: "Faculty Project not found" });
        }

        // Update the group with the selected project definition
        group.facultyprojectId = facultyProjectId;
        await group.save();

        res.status(200).json({
            message: "Project definition selected successfully",
            group: {
                _id: group._id,
                name: group.name,
                number: group.number,
                facultyProject: group.facultyprojectId, // Fully populated facultyProject object
                students: group.students,
                groupCode: group.groupCode,
                classroomId: group.classroomId,
                createdAt: group.createdAt,
                updatedAt: group.updatedAt
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



const getGroupById = async (req, res) => {
    try {
        const { groupId } = req.params;
        const group = await Group.findById(groupId).populate('students').populate('facultyprojectId').populate('classroomId');
       
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }
       
        res.json(group);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// GET ALL GROUPS
const getAllGroups = async (req, res) => {
    try {
        const groups = await Group.find().populate('students').populate('facultyprojectId').populate('classroomId');
        res.json(groups);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// CREATE GROUP
const createGroup = async (req, res) => {
    try {
        const { classroomId, students, name } = req.body;


        // Validate required fields
        if (!classroomId || !students || !name) {
            return res.status(400).json({ error: 'ClassroomId, students, and name are required' });
        }


        // Check if classroom exists
        // const classroom = await Classroom.findById(classroomId).populate('criteriaId');
        // if (!classroom) {
        //     return res.status(404).json({ error: 'Classroom not found' });
        // }


        // Check if students already exist in another group in the same classroom
        const existingGroups = await Group.find({ classroomId, students: { $in: students } });
        if (existingGroups.length > 0) {
            return res.status(400).json({ error: 'One or more students are already assigned to a group in this classroom' });
        }


        // Fetch criteria for the classroom
        // const criteria = classroom.criteriaId;


        // // Validate student count within allowed range
        // if (students.length < criteria.min_group_size || students.length > criteria.max_group_size) {
        //     return res.status(400).json({ error: `Group size must be between ${criteria.min_group_size} and ${criteria.max_group_size}` });
        // }


        // Ensure unique group name within classroom
        const existingGroup = await Group.findOne({ classroomId, name });
        if (existingGroup) {
            return res.status(400).json({ error: 'Group name must be unique within the classroom' });
        }


        // Get the next available group number in the classroom
        const lastGroup = await Group.findOne({ classroomId }).sort('-number');
        const number = lastGroup ? lastGroup.number + 1 : 1;


        // Generate a unique 6-character alphanumeric uppercase groupCode
        let groupCode;
        let isUnique = false;
        while (!isUnique) {
            groupCode = crypto.randomBytes(3).toString('hex').toUpperCase(); // Generates a 6-character code
            const existingCode = await Group.findOne({ groupCode });
            if (!existingCode) {
                isUnique = true;
            }
        }


        // Create group
        const newGroup = new Group({
            classroomId,
            students,
            name,
            number,
            groupCode
        });


        await newGroup.save();
        res.status(201).json({ message: 'Group created successfully', group: newGroup });


    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




// UPDATE GROUP - RESTRICTED (Only allow updating students and name)
const updateGroupRestricted = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { students, name } = req.body;




        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }




        // Check if students are already assigned to another group in the same classroom
        const existingGroups = await Group.find({
            classroomId: group.classroomId,
            _id: { $ne: groupId },
            students: { $in: students }
        });




        if (existingGroups.length > 0) {
            return res.status(400).json({ error: 'One or more students are already assigned to another group' });
        }




        // Update only allowed fields
        group.students = students;
        group.name = name;
        await group.save();




        res.json({ message: 'Group updated successfully', group });




    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




// UPDATE GROUP - FULL (Allow updating all fields)
const updateGroupFull = async (req, res) => {
    try {
        const { groupId } = req.params;
        const updateData = req.body;




        // If facultyprojectId is being updated, ensure it exists
        if (updateData.facultyprojectId) {
            const facultyProject = await FacultyProject.findById(updateData.facultyprojectId);
            if (!facultyProject) {
                return res.status(400).json({ error: 'Invalid facultyprojectId' });
            }
        }




        const updatedGroup = await Group.findByIdAndUpdate(groupId, updateData, { new: true });
        if (!updatedGroup) {
            return res.status(404).json({ error: 'Group not found' });
        }




        res.json({ message: 'Group updated successfully', group: updatedGroup });




    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




// DELETE GROUP
const deleteGroup = async (req, res) => {
    try {
        const { groupId } = req.params;




        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }




        // Prevent deletion if group has avg_mark > 0 and facultyprojectId exists
        if (group.avg_mark > 0 && group.facultyprojectId) {
            return res.status(400).json({ error: 'Cannot delete group with assigned marks and faculty project' });
        }




        await Group.findByIdAndDelete(groupId);
        res.json({ message: 'Group deleted successfully' });




    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getGroupByStudentId = async (req, res) => {
    try {
        const { studentId, classroomId } = req.params;


        if (!studentId) {
            return res.status(400).json({ message: "Student ID is required" });
        }


        const group = await Group.findOne({ students: studentId, classroomId })
        .populate({
            path: "groupchoice",
            populate: [{ path: "facultyId" }, { path: "projectId" }]
        })
            .populate('students')
            .populate('classroomId');


        if (!group) {
            return res.status(404).json({ message: "Group not found for this student" });
        }


        res.status(200).json(group);
    } catch (error) {
        console.error("Error fetching group:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const addGroupChoice = async (req, res) => {
    try {
        const { groupId, facultyProjectId } = req.params;

        if (!groupId || !facultyProjectId) {
            return res.status(400).json({ message: "Group ID and Faculty Project ID are required" });
        }

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        const facultyProject = await FacultyProject.findById(facultyProjectId)
            .populate("facultyId")
            .populate("projectId");
        
        if (!facultyProject) {
            return res.status(404).json({ message: "Faculty Project not found" });
        }

        if (!Array.isArray(group.groupchoice)) {
            group.groupchoice = [];
        }

        if (group.groupchoice.length >= 5) {
            return res.status(400).json({ message: "You can only select up to 5 project choices." });
        }

        if (group.groupchoice.includes(facultyProjectId)) {
            return res.status(400).json({ message: "Faculty Project already added to group choice." });
        }

        group.groupchoice.push(facultyProjectId);
        group.updatedAt = Date.now();

        await group.save();

        // ✅ Fetch again with deep population
        const updatedGroup = await Group.findById(groupId)
            .populate({
                path: "groupchoice",
                populate: [
                    { path: "facultyId", model: "Faculty" },
                    { path: "projectId", model: "Project" }
                ]
            })
            .exec();
            // console.log("Updated Group Choice Data:", JSON.stringify(updatedGroup, null, 2));

        res.status(200).json({ message: "Group choice added successfully", group: updatedGroup });

    } catch (error) {
        console.error("Error adding group choice:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


const getGroupsByClassroomId = async (req, res) => {
    try {
        const { classroomId } = req.params;

        const groups = await Group.find({ classroomId })
            .populate('facultyprojectId')
            .populate('groupchoice')
            .populate('students');

        res.status(200).json(groups);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};




module.exports = {
    findMatchingStudents,
    joinGroupByCode,
    selectProjectDefinition,
    getGroupById,
    getAllGroups,
    createGroup,
    updateGroupRestricted,
    updateGroupFull,
    deleteGroup,
    getGroupByStudentId,
    changemode,
    addGroupChoice,
    getGroupsByClassroomId
};

