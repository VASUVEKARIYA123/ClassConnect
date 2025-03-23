const express = require("express");
const router = express.Router();
const classroomStudentController = require("../controller/classroomstudentController");
const { auth } = require("../middleware/auth");
const { authorizeRole } = require("../middleware/authorizeRole");
// Routes
router.get("/classroom-student/:classroomId", auth, authorizeRole(["admin","subadmin", "teacher","student"]), classroomStudentController. getClassroomStudentsByClassroomId);
router.post("/",  auth, authorizeRole(["admin","subadmin"]), classroomStudentController.addClassroomStudent);
router.get("/classrooms", auth, authorizeRole(["admin","subadmin","teacher","student"]), classroomStudentController.getClassroomsOfStudent);
router.get("/:classroomstudentId", auth, authorizeRole(["admin","subadmin","teacher","student"]),  classroomStudentController.getClassroomStudentById);
router.get("/", auth, authorizeRole(["admin","subadmin","teacher","student"]),  classroomStudentController.getAllClassroomStudents);
router.put("/:classroomstudentId",  auth, authorizeRole(["admin","subadmin"]), classroomStudentController.updateClassroomStudent);
router.delete("/:classroomstudentId",  auth, authorizeRole(["admin","subadmin"]), classroomStudentController.deleteClassroomStudentById);
router.get("/classroom/:classroomId", auth, authorizeRole(["admin","subadmin", "teacher","student"]), classroomStudentController.getStudentsByClassroomId);

 

module.exports = router;
