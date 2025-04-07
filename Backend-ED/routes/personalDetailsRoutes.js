const express = require("express");
const router = express.Router();
const personalDetailsController = require("../controllers/personalDetailsController");

// Route to fetch all unapproved submissions
router.get("/unapproved", personalDetailsController.getUnapprovedPersonalDetails);

// Get unapproved personal details by user ID
router.get("/unapproved/:id", personalDetailsController.getUnapprovedPersonalDetailsById);

module.exports = router;


