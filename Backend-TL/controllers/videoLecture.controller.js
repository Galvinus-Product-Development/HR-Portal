const videoLectureService = require("../services/videoLecture.service");

exports.getAllVideoLectures = async (req, res) => {
  try {
    const lectures = await videoLectureService.getAllVideoLectures();
    res.json(lectures);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getVideoLectureById = async (req, res) => {
  try {
    const lecture = await videoLectureService.getVideoLectureById(
      req.params.id
    );
    res.json(lecture);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.createVideoLecture = async (req, res) => {
  try {
    const lecture = await videoLectureService.createVideoLecture(req.body);
    res.status(201).json(lecture);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateVideoLecture = async (req, res) => {
  try {
    const lecture = await videoLectureService.updateVideoLecture(
      req.params.id,
      req.body
    );
    res.json(lecture);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteVideoLecture = async (req, res) => {
  try {
    await videoLectureService.deleteVideoLecture(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
