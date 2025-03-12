const sessionService = require("../services/session.service");

exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await sessionService.getAllSessions();
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSessionById = async (req, res) => {
  try {
    const session = await sessionService.getSessionById(req.params.id);
    res.json(session);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.createSession = async (req, res) => {
  try {
    const session = await sessionService.createSession(req.body);
    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateSession = async (req, res) => {
  try {
    const session = await sessionService.updateSession(req.params.id, req.body);
    res.json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    await sessionService.deleteSession(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
