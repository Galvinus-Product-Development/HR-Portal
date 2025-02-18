const express = require("express");
const router = express.Router();
const bankController = require("../controllers/bankController");
// const validateBank = require("../middlewares/validateBank");


// Bank Routes
router.post("/",  bankController.createBank);
router.get("/", bankController.getAllBanks);
router.get("/:id", bankController.getBankById);
router.put("/:id",  bankController.updateBank);
router.delete("/:id", bankController.deleteBank);

module.exports = router;
