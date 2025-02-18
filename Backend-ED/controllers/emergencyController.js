const emergencyService = require("../services/emergencyService");

exports.createEmergencyContact = async (req, res) => {
  try {
    const contact = await emergencyService.createEmergencyContact(req.body);
    res.status(201).json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllEmergencyContacts = async (req, res) => {
  try {
    const contacts = await emergencyService.getAllEmergencyContacts();
    res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getEmergencyContactById = async (req, res) => {
  try {
    const contact = await emergencyService.getEmergencyContactById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: "Emergency contact not found" });
    }
    res.status(200).json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateEmergencyContact = async (req, res) => {
  try {
    const updatedContact = await emergencyService.updateEmergencyContact(req.params.id, req.body);
    res.status(200).json({ success: true, data: updatedContact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteEmergencyContact = async (req, res) => {
  try {
    await emergencyService.deleteEmergencyContact(req.params.id);
    res.status(200).json({ success: true, message: "Emergency contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
