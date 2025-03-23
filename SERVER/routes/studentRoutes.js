const express = require("express");
const router = express.Router();
const multer = require('multer')
const studentController = require("../controller/studentController");
const upload = multer({ storage: multer.memoryStorage() });// Memory storage for file upload
const { auth } = require("../middleware/auth");
const { authorizeRole } = require("../middleware/authorizeRole");

router.post('/import',auth, authorizeRole(["admin","subadmin"]), upload.single('file'), studentController.importStudents);
router.post('/import-in-classroom',auth, authorizeRole(["admin","subadmin"]), upload.single('file'), studentController.importStudentsWithClassroom);
router.post("/",auth, authorizeRole(["admin","subadmin"]), studentController.addStudent);
router.get("/:studentId",auth, authorizeRole(["admin","subadmin","teacher","student"]), studentController.getStudentById);
router.get("/",auth, authorizeRole(["admin","subadmin","teacher","student"]), studentController.getAllStudents);
router.put("/:studentId",auth, authorizeRole(["admin","subadmin","teacher","student"]), studentController.updateStudent);
router.delete("/:studentId",auth, authorizeRole(["admin","subadmin","teacher"]), studentController.deleteStudentById);

module.exports = router;
