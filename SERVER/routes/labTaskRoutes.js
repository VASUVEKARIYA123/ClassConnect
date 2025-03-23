const express = require("express");
const router = express.Router();
const labTaskController = require("../controller/labTaskController");
const { auth } = require("../middleware/auth");
const { authorizeRole } = require("../middleware/authorizeRole");

// Routes for Lab Tasks
router.post("/",auth, authorizeRole(["admin","subadmin","teacher"]), labTaskController.createLabTask);
router.get("/", auth, authorizeRole(["admin","subadmin","teacher"]),labTaskController.getAllLabTasks);
router.get("/:id", auth, authorizeRole(["admin","subadmin","teacher","student"]),labTaskController.getLabTaskById);
router.get("/classroom/:classroomId", auth, authorizeRole(["admin","subadmin","teacher","student"]),labTaskController.getLabTasksOfClassroom);
router.put("/:id", auth, authorizeRole(["admin","subadmin","teacher"]),labTaskController.updateLabTask);
router.delete("/:id", auth, authorizeRole(["admin","subadmin","teacher"]),labTaskController.deleteLabTask);

module.exports = router;
