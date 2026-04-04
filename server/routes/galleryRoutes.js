const express = require("express");
const router = express.Router();
const multer = require("multer");

const { uploadImage, getImages } = require("../controllers/galleryController");
const { deleteImage } = require("../controllers/galleryController");
const auth = require("../middleware/auth"); // 🔐 IMPORTANT

// 📦 Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 🖼️ Get all images (PUBLIC)
router.get("/", getImages);
router.delete("/delete", auth, deleteImage);
// 📸 Upload image (ADMIN ONLY)
router.post("/upload", auth, upload.single("image"), uploadImage);

module.exports = router;