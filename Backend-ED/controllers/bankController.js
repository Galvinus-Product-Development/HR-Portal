const bankService = require("../services/bankService");

exports.createBank = async (req, res) => {
  try {
    const bank = await bankService.createBank(req.body);
    res.status(201).json({ success: true, data: bank });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllBanks = async (req, res) => {
  try {
    const banks = await bankService.getAllBanks();
    res.status(200).json({ success: true, data: banks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBankById = async (req, res) => {
  try {
    const bank = await bankService.getBankById(req.params.id);
    if (!bank) {
      return res.status(404).json({ success: false, message: "Bank record not found" });
    }
    res.status(200).json({ success: true, data: bank });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateBank = async (req, res) => {
  try {
    const updatedBank = await bankService.updateBank(req.params.id, req.body);
    res.status(200).json({ success: true, data: updatedBank });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteBank = async (req, res) => {
  try {
    await bankService.deleteBank(req.params.id);
    res.status(200).json({ success: true, message: "Bank record deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
