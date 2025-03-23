const express = require("express");
const router = express.Router();
const classroomFacultyController = require("../controller/classroomfacultyController");
const { auth } = require("../middleware/auth");
const { authorizeRole } = require("../middleware/authorizeRole");
// Routes
router.post("/", auth, authorizeRole(["admin","subadmin"]), classroomFacultyController.addClassroomFaculty);
router.get("/classrooms", auth, authorizeRole(["admin","subadmin","teacher"]), classroomFacultyController.getClassroomsOfFaculty);
router.get("/:classroomfacultyId", auth, authorizeRole(["admin","subadmin","teacher","student"]), classroomFacultyController.getClassroomFacultyById);
router.get("/faculties-of-classroom/:classroomId", auth, authorizeRole(["admin","subadmin","teacher","student"]), classroomFacultyController.getFacultiesOfClassroom);
router.get("/", auth, authorizeRole(["admin","subadmin","teacher","student"]), classroomFacultyController.getAllClassroomFaculties);
router.put("/:classroomfacultyId", auth, authorizeRole(["admin","subadmin"]), classroomFacultyController.updateClassroomFaculty);
router.delete("/:classroomfacultyId", auth, authorizeRole(["admin","subadmin"]),  classroomFacultyController.deleteClassroomFacultyById);
router.get("/classroom/:classroomId", auth, authorizeRole(["admin","subadmin", "teacher","student"]), classroomFacultyController.getFacultiesByClassroomId);
module.exports = router;
