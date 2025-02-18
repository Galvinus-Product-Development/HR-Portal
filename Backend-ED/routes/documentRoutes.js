const express = require("express");
const router = express.Router();
const documentController = require("../controllers/documentController");
// const validateDocument = require("../middlewares/validateDocument");

// Document Routes
router.post("/",  documentController.createDocument);
router.get("/", documentController.getAllDocuments);
router.get("/:id", documentController.getDocumentById);
router.put("/:id",  documentController.updateDocument);
router.delete("/:id", documentController.deleteDocument);

module.exports = router;
