const express = require("express");
const router = express.Router();
const facultyProjectController = require("../controller/facultyprojectController");
const { auth } = require("../middleware/auth");
const { authorizeRole } = require("../middleware/authorizeRole");

// Routes
router.post("/", auth, authorizeRole(["admin","teacher"]), facultyProjectController.addFacultyProject);
router.get("/groups/:classroomId/:projectId", auth, authorizeRole(["admin","teacher"]), facultyProjectController.projectGroupCount);
router.get("/", auth, authorizeRole(["admin","teacher","student"]), facultyProjectController.getAllFacultyProjects);
router.get("/:facultyProjectId", auth, authorizeRole(["admin"]), facultyProjectController.getFacultyProjectById);
router.put("/:facultyProjectId", auth, authorizeRole(["admin","teacher"]), facultyProjectController.updateFacultyProject);
router.delete("/:facultyProjectId", auth, authorizeRole(["admin","teacher"]), facultyProjectController.deleteFacultyProject);

module.exports = router;
