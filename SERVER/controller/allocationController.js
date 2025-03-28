const Group = require('../models/Group');
const ClassroomStudent = require('../models/ClassroomStudent');
const Student = require('../models/Student');
// const Classroom = require('../models/Classroom');


const checkAllocationStatus = async (req, res) => {
    try {
        const { classroomId } = req.params;

        // Fetch all groups for the given classroom
        const groups = await Group.find({ classroomId })
            .populate('students')
            .populate('facultyprojectId');

        // Fetch all students in the classroom from ClassroomStudent
        const classroomStudents = await ClassroomStudent.find({ classroomId }).populate('studentId');
        const allStudents = classroomStudents.map(cs => cs.studentId.studentId.toLowerCase()); // Convert to lowercase

        // Collect all assigned student IDs from groups
        const assignedStudents = new Set();
        const notConfirmedStudents = new Set();

        groups.forEach(group => {
            group.students.forEach(student => assignedStudents.add(student.studentId.toLowerCase())); // Use lowercase studentId
            if (group.mode === "phase1") {
                group.students.forEach(student => notConfirmedStudents.add(student.studentId.toLowerCase()));
            }
        });

        // Students who are unallocated (not in any group)
        const unallocatedStudents = allStudents.filter(studentId => !assignedStudents.has(studentId));

        // Combine unallocated students and students in unconfirmed groups
        const studentsNotAllocatedOrNotConfirmed = [...new Set([...unallocatedStudents, ...notConfirmedStudents])];

        // Send emails to these students
        studentsNotAllocatedOrNotConfirmed.forEach(studentId => {
            const email = `${studentId}@ddu.ac.in`; // Construct email
            sendEmail(email, "Group conform or join Reminder", "Hello, please join or confirm your group as soon as possible.");
        });

        
        // Check if all groups are in phase2
        const allGroupsInPhase2 = groups.every(group => group.mode === "phase2");

        res.status(200).json({
            groups,
            unallocatedStudents,
            studentsNotAllocatedOrNotConfirmed,
            allGroupsInPhase2,
            isAllocationComplete: studentsNotAllocatedOrNotConfirmed.length === 0 && allGroupsInPhase2
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const checkProjectSelectionStatus = async (req, res) => {
    try {
      const { classroomId } = req.params;
  
      // Fetch all groups in the classroom
      const groups = await Group.find({ classroomId });
  
      let pendingGroups = [];
  
      for (let group of groups) {
        if (!group.groupchoice || group.groupchoice.length < 5) {
          pendingGroups.push(group);
        }
      }
  
      // If all groups have completed project selection, update the classroom mode to "phase2"
      if (pendingGroups.length === 0) {
        await Classroom.findByIdAndUpdate(classroomId, { mode: "phase2" });
        return res.status(200).json({ message: "All groups have completed project selection. Classroom moved to phase2." });
      }
  
      // Send email to students in pending groups
      for (let group of pendingGroups) {
        const students = await Student.find({ _id: { $in: group.students } });
  
        students.forEach((student) => {
          sendEmail((student.studentId.toLowerCase())+"@ddu.ac.in", "Project Selection Reminder", "Dear students,\n\nYour group has not completed the project selection process. Please choose your 5 project preferences as soon as possible.\n\nBest Regards,\nYour Classroom Admin");
        });
      }
  
      res.status(200).json({ message: "Reminder emails sent to pending groups." });
  
    } catch (error) {
      console.error("Error checking project selection status:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  };

const nodemailer = require("nodemailer");
const Classroom = require('../models/Classroom');

const sendEmail = async (to, subject, text) => {
  try {
    // Configure the email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // You can use other services like Outlook, Yahoo, etc.
      auth: {
        user: "22ceuos014@ddu.ac.in", // Replace with your email
        pass: "yuzifxopiwkaocto", // Replace with your email app password
      },
    });

    // Define email options
    const mailOptions = {
      from: '22ceuos014@ddu.ac.in',
      to, // Recipient email
      subject,
      text,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
};

const allocateProjects = async (req, res) => {
    try {
      const { classroomId } = req.params;
      const classroom = await Classroom.findById(classroomId);
  
      // // Step 1: Fetch all students of the classroom and sort them by CPI (descending)
      const students = await ClassroomStudent.find({ classroomId }).populate('studentId').sort({ cpi: -1 });
  
      if (!students.length) {
        return res.status(404).json({ message: "No students found in this classroom." });
      }
  
      console.log("Total students fetched:", students.length);
      
      for(const student of students){
        let group = await Group.findOne({students:student.studentId._id});
        
        for(const project of group.groupchoice){
            group.facultyprojectId = project;
            await group.save();
          break;
        }
        
      }
      classroom.mode = "phase3";
      await classroom.save();
      res.status(200).json({ message: "Project allocation completed successfully." });
    } catch (error) {
      console.error("Error in project allocation:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

module.exports = { checkAllocationStatus, checkProjectSelectionStatus ,allocateProjects};
