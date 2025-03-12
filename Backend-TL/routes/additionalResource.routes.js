const express = require("express");
const router = express.Router();
const additionalResourceController = require("../controllers/additionalresource.controller");

router.get("/", additionalResourceController.getAllResources);
router.get("/:id", additionalResourceController.getResourceById);
router.post("/", additionalResourceController.createResource);
router.put("/:id", additionalResourceController.updateResource);
router.delete("/:id", additionalResourceController.deleteResource);

module.exports = router;
