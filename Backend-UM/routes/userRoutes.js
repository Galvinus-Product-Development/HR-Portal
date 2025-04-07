const express = require("express");
const multer = require("multer");
const { uploadProfileImage,fetchProfileImage } = require("../controllers/userController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload-profile", upload.single("image"), uploadProfileImage);


router.get("/profile-picture/:userId", fetchProfileImage);

module.exports = router;

