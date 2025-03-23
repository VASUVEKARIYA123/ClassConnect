const express = require("express");
const router = express.Router();
const classroomFacultyController = require("../controller/classroomfacultyController");
const { auth } = require("../middleware/auth");
const { authorizeRole } = require("../middleware/authorizeRole");
// Routes
router.get("/classroom-faculty/:classroomId", auth, authorizeRole(["admin", "teacher","student"]), classroomFacultyController.getClassroomFacultiesByClassroomId);
router.post("/", auth, authorizeRole(["admin"]), classroomFacultyController.addClassroomFaculty);
router.get("/classrooms", auth, authorizeRole(["admin","teacher"]), classroomFacultyController.getClassroomsOfFaculty);
router.get("/:classroomfacultyId", auth, authorizeRole(["admin","teacher","student"]), classroomFacultyController.getClassroomFacultyById);
router.get("/faculties-of-classroom/:classroomId", auth, authorizeRole(["admin","teacher","student"]), classroomFacultyController.getFacultiesOfClassroom);
router.get("/", auth, authorizeRole(["admin","teacher","student"]), classroomFacultyController.getAllClassroomFaculties);
router.put("/:classroomfacultyId", auth, authorizeRole(["admin"]), classroomFacultyController.updateClassroomFaculty);
router.delete("/:classroomfacultyId", auth, authorizeRole(["admin"]),  classroomFacultyController.deleteClassroomFacultyById);
router.get("/classroom/:classroomId", auth, authorizeRole(["admin", "teacher","student"]), classroomFacultyController.getFacultiesByClassroomId);
module.exports = router;
 