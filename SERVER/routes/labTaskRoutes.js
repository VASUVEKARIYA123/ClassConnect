const express = require("express");
const router = express.Router();
const labTaskController = require("../controller/labTaskController");
const { auth } = require("../middleware/auth");
const { authorizeRole } = require("../middleware/authorizeRole");

// Routes for Lab Tasks
router.post("/",auth, authorizeRole(["admin","teacher"]), labTaskController.createLabTask);
router.get("/", auth, authorizeRole(["admin","teacher"]),labTaskController.getAllLabTasks);
router.get("/:id", auth, authorizeRole(["admin","teacher","student"]),labTaskController.getLabTaskById);
router.get("/classroom/:classroomId", auth, authorizeRole(["admin","teacher","student"]),labTaskController.getLabTasksOfClassroom);
router.put("/:id", auth, authorizeRole(["admin","teacher"]),labTaskController.updateLabTask);
router.delete("/:id", auth, authorizeRole(["admin","teacher"]),labTaskController.deleteLabTask);

module.exports = router;
