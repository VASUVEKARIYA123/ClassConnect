const express = require("express");
const router = express.Router();
const projectController = require("../controller/projectController");
const { auth } = require("../middleware/auth");
const { authorizeRole } = require("../middleware/authorizeRole");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });// Memory storage for file upload
// Routes
router.post("/", auth, authorizeRole(["admin","subadmin","teacher"]),projectController.addProject);
router.post("/import",auth, authorizeRole(["admin","subadmin","teacher"]), upload.single("file"), projectController.importProjects);
router.get("/:projectId", auth, authorizeRole(["admin","subadmin","teacher","student"]),projectController.getProjectById);
router.get("/", auth, authorizeRole(["admin","subadmin","teacher","student"]), projectController.getAllProjects);
router.put("/:projectId", auth, authorizeRole(["admin","subadmin","teacher"]),projectController.updateProject);
router.delete("/:projectId", auth, authorizeRole(["admin","subadmin"]),projectController.deleteProjectById);

module.exports = router;
