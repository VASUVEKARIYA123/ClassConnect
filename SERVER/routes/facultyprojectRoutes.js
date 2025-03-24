const express = require("express");
const router = express.Router();
const facultyProjectController = require("../controller/facultyprojectController");
const { auth } = require("../middleware/auth");
const { authorizeRole } = require("../middleware/authorizeRole");

// Routes
router.post("/", auth, authorizeRole(["admin","subadmin","teacher"]), facultyProjectController.addFacultyProject);
router.get("/groups/:classroomId/:projectId", auth, authorizeRole(["admin","subadmin","teacher"]), facultyProjectController.projectGroupCount);
router.get("/fp/:facultyId/:classroomId",auth,authorizeRole(["admin", "subadmin", "teacher", "student"]),facultyProjectController.getFacultyProjectsByClassroomAndFacId);
router.get("/", auth, authorizeRole(["admin","subadmin","teacher","student"]), facultyProjectController.getAllFacultyProjects);
router.get("/:facultyProjectId", auth, authorizeRole(["admin","subadmin","teacher"]), facultyProjectController.getFacultyProjectById);
router.put("/:facultyProjectId", auth, authorizeRole(["admin","subadmin","teacher"]), facultyProjectController.updateFacultyProject);
router.delete("/:facultyProjectId", auth, authorizeRole(["admin","subadmin","teacher"]), facultyProjectController.deleteFacultyProject);

module.exports = router;
