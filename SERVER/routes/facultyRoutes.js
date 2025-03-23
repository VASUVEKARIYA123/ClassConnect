const express = require("express");
const router = express.Router();
const facultyController = require("../controller/facultyController");
const { auth } = require("../middleware/auth");
const { authorizeRole } = require("../middleware/authorizeRole");
const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage() });// Memory storage for file upload
// Routes
router.post("/", auth, authorizeRole(["admin","subadmin"]), facultyController.addFaculty);
router.post("/import-in-classroom", auth, authorizeRole(["admin","subadmin"]), upload.single('file'),facultyController.importFacultiesWithClassroom);
router.get("/:facultyId", auth, authorizeRole(["admin","subadmin","teacher","student"]), facultyController.getFacultyById);
router.get("/", auth, authorizeRole(["admin","subadmin","teacher","student"]), facultyController.getAllFaculties);
router.put("/admin/:facultyId", auth, authorizeRole(["admin","subadmin"]), facultyController.updateFacultybyadmin);
router.put("/faculty/:facultyId", auth, authorizeRole(["teacher"]), facultyController.updateFacultybyfaculty);
router.delete("/:facultyId", auth, authorizeRole(["admin","subadmin"]), facultyController.deleteFacultyById);
router.patch("/change-faculty-role-to-subadmin/:facultyId", auth, authorizeRole(["admin","subadmin"]), facultyController.changeRoleTosubAdmin);
router.patch("/change-faculty-role-to-teacher/:facultyId", auth, authorizeRole(["admin","subadmin"]), facultyController.changeRoleToTeacher);
router.patch("/update-rating/:facultyId", auth, authorizeRole(["admin","subadmin"]), facultyController.updateRating);
module.exports = router;
