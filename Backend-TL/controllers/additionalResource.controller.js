const additionalResourceService = require("../services/additionalResource.service");

exports.getAllResources = async (req, res) => {
  try {
    const resources = await additionalResourceService.getAllResources();
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getResourceById = async (req, res) => {
  try {
    const resource = await additionalResourceService.getResourceById(
      req.params.id
    );
    res.json(resource);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.createResource = async (req, res) => {
  try {
    const resource = await additionalResourceService.createResource(req.body);
    res.status(201).json(resource);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateResource = async (req, res) => {
  try {
    const resource = await additionalResourceService.updateResource(
      req.params.id,
      req.body
    );
    res.json(resource);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteResource = async (req, res) => {
  try {
    await additionalResourceService.deleteResource(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
