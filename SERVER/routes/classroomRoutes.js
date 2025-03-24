const express = require("express");
const router = express.Router();
const classroomController = require("../controller/classroomController");
const { auth } = require("../middleware/auth");
const { authorizeRole } = require("../middleware/authorizeRole");
// Routes
router.post("/", auth, authorizeRole(["admin","subadmin"]), classroomController.addClassroom);
router.get("/classroom/:classroomId/projects", auth, authorizeRole(["admin","subadmin","teacher"]),classroomController.getProjectsByClassroom);
router.post('/add-project', classroomController.addProjectToClassroom);
router.post('/remove-project', classroomController.removeProjectFromClassroom);
router.get("/:classroomId", auth, authorizeRole(["admin","subadmin","teacher","student"]), classroomController.getClassroomById);
router.get("/", auth, authorizeRole(["admin","subadmin"]), classroomController.getAllClassrooms);
router.put("/:classroomId", auth, authorizeRole(["admin","subadmin"]), classroomController.updateClassroom);
router.delete("/:classroomId",auth, authorizeRole(["admin","subadmin"]),  classroomController.deleteClassroomById);

module.exports = router;
