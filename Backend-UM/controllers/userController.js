const { updateProfilePicture ,getProfilePicture} = require("../services/userService");

const uploadProfileImage = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const updatedUser = await updateProfilePicture(userId, req.file);

    res.json({ success: true, profilePicture: updatedUser.profilePicture });
  } catch (error) {
    console.log("image upload error",error);
    res.status(500).json({ error: error.message });
  }
};



const fetchProfileImage = async (req, res) => {
  try {
    const { userId } = req.params;
    const imageUrl = await getProfilePicture(userId);

    if (!imageUrl) {
      return res.status(404).json({ error: "Profile picture not found" });
    }

    res.json({ profilePicture: imageUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};





module.exports = { uploadProfileImage ,fetchProfileImage};
