const express = require("express");
const router = express.Router();
const courseMaterialController = require("../controllers/coursematerial.controller");

router.get("/", courseMaterialController.getAllCourseMaterials);
router.get("/:id", courseMaterialController.getCourseMaterialById);
router.post("/", courseMaterialController.createCourseMaterial);
router.put("/:id", courseMaterialController.updateCourseMaterial);
router.delete("/:id", courseMaterialController.deleteCourseMaterial);

module.exports = router;
