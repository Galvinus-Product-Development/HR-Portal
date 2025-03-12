const trainerService = require("../services/trainer.service");

exports.getAllTrainers = async (req, res) => {
  try {
    const trainers = await trainerService.getAllTrainers();
    res.json(trainers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTrainerById = async (req, res) => {
  try {
    const trainer = await trainerService.getTrainerById(req.params.id);
    res.json(trainer);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.createTrainer = async (req, res) => {
  try {
    const trainer = await trainerService.createTrainer(req.body);
    res.status(201).json(trainer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateTrainer = async (req, res) => {
  try {
    const trainer = await trainerService.updateTrainer(req.params.id, req.body);
    res.json(trainer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteTrainer = async (req, res) => {
  try {
    await trainerService.deleteTrainer(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
