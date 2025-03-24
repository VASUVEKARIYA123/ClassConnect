const express = require("express");
const router = express.Router();
const allocationController = require("../controller/allocationController");
const { auth } = require("../middleware/auth");
const { authorizeRole } = require("../middleware/authorizeRole");

// Routes
router.get(
  "/status/:classroomId",
  auth,
  authorizeRole(["admin", "teacher"]),
  allocationController.checkAllocationStatus
);

router.get(
  "/project-selection-status/:classroomId",
  auth,
  authorizeRole(["admin", "teacher"]),
  allocationController.checkProjectSelectionStatus
);

router.get(
  "/allocate/:classroomId",
  auth, 
  authorizeRole(["admin", "teacher"]),
  allocationController.allocateProjects
);

module.exports = router;
