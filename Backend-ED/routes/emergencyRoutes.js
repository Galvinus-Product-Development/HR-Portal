const express = require("express");
const router = express.Router();
const emergencyController = require("../controllers/emergencyController");
// const validateEmergency = require("../middlewares/validateEmergency");

// Emergency Routes
router.post("/",  emergencyController.createEmergencyContact);
router.get("/", emergencyController.getAllEmergencyContacts);
router.get("/:id", emergencyController.getEmergencyContactById);
router.put("/:id",  emergencyController.updateEmergencyContact);
router.delete("/:id", emergencyController.deleteEmergencyContact);

module.exports = router;
