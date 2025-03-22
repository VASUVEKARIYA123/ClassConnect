const express = require("express");
const router = express.Router();
const classroomController = require("../controller/classroomController");
const { auth } = require("../middleware/auth");
const { authorizeRole } = require("../middleware/authorizeRole");
// Routes
router.post("/", auth, authorizeRole(["admin"]), classroomController.addClassroom);
router.get("/:classroomId", auth, authorizeRole(["admin","teacher","student"]), classroomController.getClassroomById);
router.get("/", auth, authorizeRole(["admin"]), classroomController.getAllClassrooms);
router.put("/:classroomId", auth, authorizeRole(["admin"]), classroomController.updateClassroom);
router.delete("/:classroomId",auth, authorizeRole(["admin"]),  classroomController.deleteClassroomById);

module.exports = router;
