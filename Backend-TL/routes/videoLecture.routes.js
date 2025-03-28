const express = require("express");
const router = express.Router();
const videoLectureController = require("../controllers/videoLecture.controller");

router.get("/", videoLectureController.getAllVideoLectures);
router.get("/:id", videoLectureController.getVideoLectureById);
router.post("/", videoLectureController.createVideoLecture);
router.put("/:id", videoLectureController.updateVideoLecture);
router.delete("/:id", videoLectureController.deleteVideoLecture);

module.exports = router;
