const trainingService = require("../services/training.service");

exports.getAllTrainings = async (req, res) => {
  try {
    const trainings = await trainingService.getAllTrainings();
    console.log("Here>>>>>>>>>>>>>>>>", trainings);
    res.json(trainings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTrainingById = async (req, res) => {
  try {
    const training = await trainingService.getTrainingById(req.params.id);
    res.json(training);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.createTraining = async (req, res) => {
  try {
    console.log(req.body);
    const training = await trainingService.createTraining(req.body);
    res.status(201).json(training);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateTraining = async (req, res) => {
  try {
    const training = await trainingService.updateTraining(
      req.params.id,
      req.body
    );
    res.json(training);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteTraining = async (req, res) => {
  try {
    await trainingService.deleteTraining(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getFormattedTrainings = async (req, res) => {
  try {
    const trainingsData = await trainingService.fetchFormattedTrainings();
    res.status(200).json(trainingsData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message, error });
  }
};

// Get a single training
exports.getFormattedTrainingById = async (req, res) => {
  try {
    const { id } = req.params;
    const training = await trainingService.getTrainingByyId(id);

    if (!training)
      return res.status(404).json({ message: "Training not found" });

    const formattedTraining = {
      id: training.id,
      title: training.title,
      description: training.description,
      trainer: training.trainer
        ? {
            id: training.trainer.id,
            name: training.trainer.name,
            expertise: training.trainer.expertise,
            avatar:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
          }
        : null,
      startDate: training.startDate.toISOString().split("T")[0],
      endDate: training.endDate.toISOString().split("T")[0],
      duration: `${Math.ceil(
        (new Date(training.endDate) - new Date(training.startDate)) /
          (1000 * 60 * 60 * 24 * 7)
      )} weeks`,
      status: training.activeTraining ? "In Progress" : "Completed",
      participants: training.participants.map((participant) => ({
        id: participant.id,
        name: participant.employee?.name || "Unknown",
        department: participant.employee?.department || "N/A",
        email: participant.employee?.email || "N/A",
        phone: "123-456-7890",
      })),
      progress: training.courseProgress,
      resources: [
        ...training.materialFiles.map((material) => ({
          title: material.title,
          url: material.fileUrl,
          type: "pdf",
        })),
        ...training.lectureFiles.map((lecture) => ({
          title: lecture.title,
          url: lecture.videoUrl,
          type: "video",
        })),
        ...training.resourceFiles.map((resource) => ({
          title: resource.title,
          url: resource.resourceUrl,
          type: "link",
        })),
      ],
      certificationAvailable: training.certificationAvailable,
    };

    res.json(formattedTraining);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
