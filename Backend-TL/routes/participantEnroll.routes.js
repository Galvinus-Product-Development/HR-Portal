const express = require("express");
const router = express.Router();
const {
  participantsEnroll,
} = require("../controllers/participantEnroll.controller");

router.post("/", participantsEnroll);

module.exports = router;
