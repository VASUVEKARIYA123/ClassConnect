require("dotenv").config();
const mongoose = require("mongoose");
const express = require('express');

// const DbConnector = require('./config/dbConnector');
const studentRoutes = require('./routes/studentRoutes');
const facultyRoutes = require('./routes/facultyRoutes')
const projectRoutes = require('./routes/projectRoutes')
const classroomRoutes = require('./routes/classroomRoutes')
const classroomfacultyRoutes = require('./routes/classroomfacultyRoutes')
const classroomstudentRoutes = require('./routes/classroomstudentRoutes')
const criteriaRoutes = require('./routes/criteriaRoutes')
const facultyprojectRoutes = require('./routes/facultyprojectRoutes')
const groupRoutes = require('./routes/groupRoutes')
const authRoutes = require('./routes/authRoutes');
const labTaskRoutes = require("./routes/labTaskRoutes");

const app = express();
const cors = require('cors');
const nodeMailer = require('nodemailer');
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
app.use(cookieParser());
app.use(cors({ 
  origin: "http://localhost:3000", // Remove trailing slash `/`
  credentials: true
}));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/faculties", facultyRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/classroom-faculties", classroomfacultyRoutes);
app.use("/api/classroom-students", classroomstudentRoutes);
app.use("/api/criteria", criteriaRoutes);
app.use("/api/classrooms", classroomRoutes);
app.use("/api/faculty-projectes", facultyprojectRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/lab-tasks", labTaskRoutes);

app.post("/send-mail", (req, res) => {

    const { from, to, message, password } = req.body;

    console.log("Email : ");
    console.log(`From : ${from} To: ${to} Message: ${message} Password: ${password}`);
    let transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: from,
            pass: password
        }
    });

    const mailOpt = {
        from: from,
        to: to,
        subject: "Estate Prime",
        text: message,
    }

    transporter.sendMail(mailOpt, (err, info) => {
        if (err) {
            console.log('Failed : ' + err);
            return;
        }

        console.log('Success');
        console.log(info);
    });

});


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => console.log(err));

// app.listen(process.env.PORT, () => {
//     // const testGroup = new Group({
//     //     facultyprojectId:"67c5f0749c8ca178cfc1c0e5",
//     //     students:["67c5c9dd297e8ad90ba02ad0","67c5d8d77061fc5244c561a9"],
//     //     name:"Dumb Developers",
//     //     number:7,
//     //     classroomId:"67c5d3344788ab518371cccf"
//     // });
      
//     //   testGroup
//     //     .save()
//     //     .then(() => console.log("Classroom Student saved"))
//     //     .catch((err) => console.error("Error saving classroom student:", err));
//     console.log("Server running at : http://localhost:"+process.env.PORT+"/");
// });