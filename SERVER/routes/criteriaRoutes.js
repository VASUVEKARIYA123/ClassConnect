const express = require("express");
const router = express.Router();
const criteriaController = require("../controller/criteriaController");
const { auth } = require("../middleware/auth");
const { authorizeRole } = require("../middleware/authorizeRole");
// Routes
router.post("/",auth, authorizeRole(["admin"]), criteriaController.addCriteria);
router.get("/:criteriaId",auth, authorizeRole(["admin"]), criteriaController.getCriteriaById);
router.get("/",auth, authorizeRole(["admin"]), criteriaController.getAllCriteria);
router.put("/:criteriaId",auth, authorizeRole(["admin"]), criteriaController.updateCriteria);
router.delete("/:criteriaId",auth, authorizeRole(["admin"]), criteriaController.deleteCriteriaById);

module.exports = router;
