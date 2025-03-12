const courseMaterialService = require("../services/courseMaterial.service");

exports.getAllCourseMaterials = async (req, res) => {
  try {
    const materials = await courseMaterialService.getAllCourseMaterials();
    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCourseMaterialById = async (req, res) => {
  try {
    const material = await courseMaterialService.getCourseMaterialById(
      req.params.id
    );
    res.json(material);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.createCourseMaterial = async (req, res) => {
  try {
    const material = await courseMaterialService.createCourseMaterial(req.body);
    res.status(201).json(material);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateCourseMaterial = async (req, res) => {
  try {
    const material = await courseMaterialService.updateCourseMaterial(
      req.params.id,
      req.body
    );
    res.json(material);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteCourseMaterial = async (req, res) => {
  try {
    await courseMaterialService.deleteCourseMaterial(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
