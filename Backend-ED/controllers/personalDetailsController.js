const personalDetailsService = require("../services/personalDetailsService");

exports.getUnapprovedPersonalDetails = async (req, res) => {
  const result = await personalDetailsService.getUnapprovedPersonalDetails();

  if (!result.success) {
    return res.status(500).json({ error: result.error });
  }

  return res.status(200).json({ submissions: result.data });
};

exports.getUnapprovedPersonalDetailsById = async (req, res) => {
  const userId = req.params.id;

  const result = await personalDetailsService.getUnapprovedPersonalDetailsById(userId);

  if (!result.success) {
    return res.status(result.status).json({ error: result.error });
  }

  return res.status(200).json({ submission: result.data });
};
