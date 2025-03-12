const participantService = require("../services/participant.service");

exports.getAllParticipants = async (req, res) => {
  try {
    const participants = await participantService.getAllParticipants();
    res.json(participants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getParticipantById = async (req, res) => {
  try {
    const participant = await participantService.getParticipantById(
      req.params.id
    );
    res.json(participant);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.createParticipant = async (req, res) => {
  try {
    const participant = await participantService.createParticipant(req.body);
    res.status(201).json(participant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateParticipant = async (req, res) => {
  try {
    const participant = await participantService.updateParticipant(
      req.params.id,
      req.body
    );
    res.json(participant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteParticipant = async (req, res) => {
  try {
    await participantService.deleteParticipant(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
