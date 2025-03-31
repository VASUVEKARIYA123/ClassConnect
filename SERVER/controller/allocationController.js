const Group = require('../models/Group');
const ClassroomStudent = require('../models/ClassroomStudent');
const Student = require('../models/Student');
const Project = require('../models/Project');
const Classroomfaculty = require('../models/ClassroomFaculty');
const FacultyProject = require('../models/FacultyProject');
// const Classroom = require('../models/Classroom');
// const Classroom = require('../models/Classroom');


const checkGroupFormationStatus = async (req, res) => {
  try {
      const { classroomId } = req.params;

      // Fetch all students in the classroom
      const classroomStudents = await ClassroomStudent.find({ classroomId }).populate('studentId');
      const allStudents = classroomStudents.map(cs => cs.studentId);

      // Fetch all groups in the classroom
      const groups = await Group.find({ classroomId }).populate('students');

      // Collect all students who are already in a group
      const groupedStudents = new Set();
      const unconfirmedGroups = [];

      groups.forEach(group => {
          group.students.forEach(student => groupedStudents.add(student._id.toString()));

          if (!group.confirmed) { // If group is not confirmed
              unconfirmedGroups.push(group);
          }
      });

      // Students who haven't formed a group
      const studentsWithoutGroup = allStudents.filter(student => !groupedStudents.has(student._id.toString()));

      // Send emails to students who haven't joined a group
      studentsWithoutGroup.forEach(student => {
          sendEmail(
              `${student.studentId.toLowerCase()}@ddu.ac.in`,
              "Group Formation Reminder",
              `Hello ${student.name},\n\nYou have not joined a group yet. Please form a group as soon as possible to proceed with the project selection.\n\nBest Regards,\nYour Classroom Admin`
          );
      });

      // Send emails to groups that haven’t confirmed
      unconfirmedGroups.forEach(group => {
          group.students.forEach(student => {
              sendEmail(
                  `${student.studentId.toLowerCase()}@ddu.ac.in`,
                  "Group Confirmation Reminder",
                  `Dear ${student.name},\n\nYour group has not yet been confirmed. Please confirm your group as soon as possible.\n\nBest Regards,\nYour Classroom Admin`
              );
          });
      });

      res.status(200).json({
          studentsWithoutGroup,  // List of students who haven't formed a group
          unconfirmedGroups,     // List of groups that haven't confirmed
          isGroupFormationComplete: studentsWithoutGroup.length === 0 && unconfirmedGroups.length === 0
      });

  } catch (error) {
      console.error("Error checking group formation status:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
};



//////////////////////////////////////
/// for group 
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
        const allGroupsInPhase2 = groups.every(group => (group.mode === "phase2" || group.mode === "phase3") );

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
        return res.status(200).json({ message: "All groups have completed project selection. Classroom moved to phase2.", projectSelectionStatus: true });
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
// const FacultyProject = require('../models/FacultyProject');

const sendEmail = async (to, subject, text) => {
  try {
    // Configure the email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // You can use other services like Outlook, Yahoo, etc.
      auth: {
        user: process.EMAIL_HOST, // Replace with your email
        pass: process.EMAIL_PASS_KEY, // Replace with your email app password
      },
    });

    // Define email options
    const mailOptions = {
      from: process.EMAIL_HOST,
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


const allocateProjectsRound1 = async (req, res) => {
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
        let group = await Group.findOne({students:student.studentId._id, classroomId});
        if(!group){
          return res.status(404).json({ message: "No group found for this student." });
        }

        if(group.mode === "phase4"){
          continue;
        }
        
        for(const projectId of group.groupchoice){
            //1. first check that project with same faculty allocated to some one or not
            // console.log(projectId);
            
            const project = await FacultyProject.findById(projectId);
            if(project.allocated){
                console.log("Project already allocated to another group:", project._id);
                continue; // Skip to the next project if already allocated
            }  
            // console.log(project);
            
            //2. if this project is allocated to this group then max_group can select this project criteria match
            const pro = await Project.findById(project.projectId);
            if (!pro) {
                console.log("Project not found:", pro._id);
                continue; // Skip to the next project if not found
            }
            
            const selected_same_project = await FacultyProject.find({ projectId: project.projectId, classroomId: classroomId });
            if (selected_same_project.length >= pro.max_groups) {
                console.log("this project defination reached max selection criteria:", project._id);
                continue; // Skip to the next project if already allocated
            }

            //3. faculties max_student and remaining student check
            const cf = await Classroomfaculty.findOne({classroomId,facultyId: project.facultyId});
            const faculty = await Faculty.findById(cf.facultyId);
            // console.log(cf);
            
            if (!cf) {
                console.log("Faculty not found:", cf._id);
                continue; // Skip to the next project if not found
            }

            if(cf.remaining_student-group.students.length < 0){
                console.log("Faculty max student reached:", cf._id);
                continue; // Skip to the next project if already allocated
            }
            if(cf.remaining_student-group.students.length === 0){
                // find cf of all in this classroom and among then select max allnumber 
                const cf_for_number = await Classroomfaculty.find({classroomId:classroom._id}).sort({allnumber:-1});
                const number = cf_for_number[0].allonumber;
                cf.allnumber = number + 1; // Increment the allonumber for the faculty
                await cf.save();
            }
            //4. if all criteria match then allocate this project to this group
            group.facultyprojectId = project._id;
            group.mode = "phase4";
            project.allocated = true;
            cf.remaining_student -= group.students.length; // Decrease the remaining student count
            await cf.save();
            await group.save(); // Save the group with the allocated project
            await project.save(); // Save the project with the allocated status
            console.log("Project allocated to group:", project._id);

            //send main to student about project allocation

            sendEmail((student.studentId.studentId.toLowerCase())+"@ddu.ac.in", "Project Allocation","you have been allocated to project\nProject defination : "+pro.defination+"\nDomain : "+pro.domain+"\nMentor : "+faculty.firstname+" "+faculty.lastname);

            break;
          
        }
        
      }
      //check all group allocation has done or we need to do second rount
      for(const student of students){
        let group = await Group.findOne({students:student.studentId._id, classroomId});

        if(group.mode !== "phase4"){
            console.log("Project allocation not completed for all groups.");
            classroom.mode = "phase3"; // Set mode to phase2 if not all groups are allocated
            await classroom.save();
            return res.status(200).json({ message: "Project allocation not completed for all groups." });
        }


      }
      classroom.mode = "phase4";
      await classroom.save();
      res.status(200).json({ message: "Project allocation completed successfully." });
    } catch (error) {
      console.error("Error in project allocation:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
    //   for(const student of students){
    //     let group = await Group.findOne({students:student.studentId._id});
        
    //     for(const project of group.groupchoice){
    //         group.facultyprojectId = project;
    //         await group.save();
    //       break;
    //     }
        
    //   }
    //   classroom.mode = "phase3";
    //   await classroom.save();
    //   res.status(200).json({ message: "Project allocation completed successfully." });
    // } catch (error) {
    //   console.error("Error in project allocation:", error);
    //   res.status(500).json({ message: "Internal Server Error" });
    // }
  };

const allocateProjectsRound2 = async (req, res) => {
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
        let group = await Group.findOne({students:student.studentId._id, classroomId});
        if(!group){
          return res.status(404).json({ message: "No group found for this student." });
        }

        if(group.mode === "phase4"){
          continue;
        }
        
        for(const projectId of group.groupchoice){
            //1. first check that project with same faculty allocated to some one or not
            // console.log(projectId);
            
            const project = await FacultyProject.findById(projectId);
            if(project.allocated){
                console.log("Project already allocated to another group:", project._id);
                continue; // Skip to the next project if already allocated
            }  
            // console.log(project);
            
            //2. if this project is allocated to this group then max_group can select this project criteria match
            const pro = await Project.findById(project.projectId);
            if (!pro) {
                console.log("Project not found:", pro._id);
                continue; // Skip to the next project if not found
            }
            
            const selected_same_project = await FacultyProject.find({ projectId: project.projectId, classroomId: classroomId });
            if (selected_same_project.length >= pro.max_groups) {
                console.log("this project defination reached max selection criteria:", project._id);
                continue; // Skip to the next project if already allocated
            }

            //3. faculties max_student and remaining student check
            const cf = await Classroomfaculty.findOne({classroomId,facultyId: project.facultyId});
            const faculty = await Faculty.findById(cf.facultyId);
            // console.log(cf);
            
            if (!cf) {
                console.log("Faculty not found:", cf._id);
                continue; // Skip to the next project if not found
            }

            if(cf.remaining_student-group.students.length < 0){
                console.log("Faculty max student reached:", cf._id);
                continue; // Skip to the next project if already allocated
            }
            if(cf.remaining_student-group.students.length === 0){
                // find cf of all in this classroom and among then select max allnumber 
                const cf_for_number = await Classroomfaculty.find({classroomId:classroom._id}).sort({allnumber:-1});
                const number = cf_for_number[0].allonumber;
                cf.allnumber = number + 1; // Increment the allonumber for the faculty
                await cf.save();
            }
            //4. if all criteria match then allocate this project to this group
            group.facultyprojectId = project._id;
            group.mode = "phase4";
            project.allocated = true;
            cf.remaining_student -= group.students.length; // Decrease the remaining student count
            await cf.save();
            await group.save(); // Save the group with the allocated project
            await project.save(); // Save the project with the allocated status
            console.log("Project allocated to group:", project._id);

            //send main to student about project allocation

            sendEmail((student.studentId.studentId.toLowerCase())+"@ddu.ac.in", "Project Allocation","you have been allocated to project\nProject defination : "+pro.defination+"\nDomain : "+pro.domain+"\nMentor : "+faculty.firstname+" "+faculty.lastname);

            break;
          
        }
        
      }
      //check all group allocation has done or we randomly allocate project
      const afaculty = Classroomfaculty.find({division:"A",classroomId}).sort({remaining_student:-1});
      const bfaculty = Classroomfaculty.find({division:"B",classroomId}).sort({remaining_student:-1});

      for(const student of students){
        let group = await Group.findOne({students:student.studentId._id, classroomId});

        if(group.mode !== "phase4"){
            if(student.division === "A"){
              for(let fac of afaculty){
                if(fac.remaining_student-group.students.length >= 0){
                  let project_random = await FacultyProject.findOne({facultyId:fac.facultyId,classroomId:classroomId,allocated:"false"});

                  group.facultyprojectId = project_random._id;
                  group.mode = "phase4";
                  project_random.allocated = true;
                  fac.remaining_student -= group.students.length; // Decrease the remaining student count
                  await fac.save();
                  await group.save(); // Save the group with the allocated project
                  await project_random.save(); // Save the project with the allocated status
                  console.log("Project allocated to group:", project._id);
                  break;

                }
              }
            }
            else{
              for(let fac of bfaculty){
                if(fac.remaining_student-group.students.length >= 0){
                  let project_random = await FacultyProject.findOne({facultyId:fac.facultyId,classroomId:classroomId,allocated:"false"});

                  group.facultyprojectId = project_random._id;
                  group.mode = "phase4";
                  project_random.allocated = true;
                  fac.remaining_student -= group.students.length; // Decrease the remaining student count
                  await fac.save();
                  await group.save(); // Save the group with the allocated project
                  await project_random.save(); // Save the project with the allocated status
                  console.log("Project allocated to group:", project._id);
                  break;

                }
              }
            }
        }


      }
      classroom.mode = "phase4";
      await classroom.save();
      res.status(200).json({ message: "Project allocation completed successfully." });
    } catch (error) {
      console.error("Error in project allocation:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
    //   for(const student of students){
    //     let group = await Group.findOne({students:student.studentId._id});
        
    //     for(const project of group.groupchoice){
    //         group.facultyprojectId = project;
    //         await group.save();
    //       break;
    //     }
        
    //   }
    //   classroom.mode = "phase3";
    //   await classroom.save();
    //   res.status(200).json({ message: "Project allocation completed successfully." });
    // } catch (error) {
    //   console.error("Error in project allocation:", error);
    //   res.status(500).json({ message: "Internal Server Error" });
    // }
  };

module.exports = { checkAllocationStatus, checkProjectSelectionStatus ,allocateProjectsRound1, allocateProjectsRound2};
