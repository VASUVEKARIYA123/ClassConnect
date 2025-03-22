const express = require("express");
const router = express.Router();
const groupController = require("../controller/groupController");
const { auth } = require("../middleware/auth");
const { authorizeRole } = require("../middleware/authorizeRole");
// Routes
router.post("/", auth, authorizeRole(["admin","teacher","student"]), groupController.createGroup);
router.post('/join-group/:groupCode/:studentId',auth, authorizeRole(["student"]),  groupController.joinGroupByCode);
router.post("/:classroomId/:projectId",auth, authorizeRole(["admin","teacher","student"]),  groupController.createGroup);
router.put('/select-project/:groupId/:facultyProjectId',auth, authorizeRole(["admin","teacher","student"]),  groupController.selectProjectDefinition);
router.put("/full/:groupId",auth, authorizeRole(["admin","teacher","student"]),  groupController.updateGroupFull);
router.put("/changemode/:groupId",auth, authorizeRole(["admin","teacher","student"]),  groupController.changemode);
router.delete("/:groupId", auth, authorizeRole(["admin","teacher","student"]), groupController.deleteGroup);
router.get("/:groupId", auth, authorizeRole(["admin","teacher","student"]), groupController.getGroupById);
router.get("/", auth, authorizeRole(["admin","teacher"]), groupController.getAllGroups);
router.get('/student/:studentId',auth, authorizeRole(["admin","teacher","student"]),  groupController.getGroupByStudentId);
module.exports = router;