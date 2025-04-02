const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

// Allowed file types based on usage
const fileTypes = {
  images: /jpeg|jpg|png/,
  documents: /pdf|doc|docx/,
  videos: /mp4|mov|avi|mkv/,
  all: /jpeg|jpg|png|mp4|mov|avi|mkv|pdf|doc|docx/,
  templates: /jpeg|jpg|png|pdf|doc|docx/  // Templates formats
};

// Dynamic file filter based on usage
const getFileFilter = (usage) => {
  return (req, file, cb) => {
    const extname = fileTypes[usage].test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes[usage].test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error(`Invalid file type. Allowed formats: ${fileTypes[usage]}`));
  };
};

// Local storage configuration
const getLocalStorage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(`./uploads/${folder}`);
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });

// Upload profile image middleware (JPEG, JPG, PNG only)
const uploadProfileImage = (req, res, next) => {
  try {
    const storage = getLocalStorage("profile_images");
    const upload = multer({
      storage,
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter: getFileFilter("images"),
    }).single("profile_image");

    upload(req, res, (err) => {
      if (err) return res.status(400).json({ message: err.message });
      next();
    });
  } catch (error) {
    res.status(500).json({ message: "Error in file upload configuration." });
  }
};

// Upload site images middleware (JPEG, JPG, PNG only)
const uploadSiteImages = (req, res, next) => {
  try {
    const storage = getLocalStorage("settings_images");

    const upload = multer({
      storage,
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per image
      fileFilter: getFileFilter("images"),
    }).fields([
      { name: "site_icon", maxCount: 1 },
      { name: "site_logo", maxCount: 1 },
      { name: "site_dark_logo", maxCount: 1 },
    ]);

    upload(req, res, (err) => {
      if (err) return res.status(400).json({ message: err.message });
      next();
    });
  } catch (error) {
    res.status(500).json({ message: "Error in file upload configuration." });
  }
};

// Upload multiple files middleware (Images, Videos, and Documents)
const uploadFiles = (req, res, next) => {
  try {
    const storage = getLocalStorage("courses");
    const upload = multer({
      storage,
      limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
      fileFilter: getFileFilter("all"),
    }).fields([
      { name: "course_image", maxCount: 1 },
      { name: "preview_video", maxCount: 1 },
      { name: "certificate_template", maxCount: 1 }, // Add this line
      { name: "lesson_videos", maxCount: 50 },
      { name: "lesson_images", maxCount: 50 },
      { name: "lesson_documents", maxCount: 50 },
    ]);

    upload(req, res, (err) => {
      if (err) return res.status(400).json({ message: err.message });
      next();
    });
  } catch (error) {
    res.status(500).json({ message: "Error in file upload configuration." });
  }
};

// Upload certificate templates middleware (JPEG, JPG, PNG only)
const uploadCertificateTemplate = (req, res, next) => {
  try {
    const storage = getLocalStorage("certifications");

    const upload = multer({
      storage,
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
      fileFilter: getFileFilter("images"),
    }).single("template"); // Only one template per course

    upload(req, res, (err) => {
      if (err) return res.status(400).json({ message: err.message });
      next();
    });
  } catch (error) {
    res.status(500).json({ message: "Error in certificate template upload configuration." });
  }
};

// Upload multiple template files middleware (JPEG, JPG, PNG, PDF, DOC, DOCX)
const uploadTemplateFiles = (req, res, next) => {
  try {
    const storage = getLocalStorage("templates");

    // Create dynamic fields to handle multiple files from frontend
    const fieldConfig = Array.from({ length: 20 }, (_, i) => ({ 
      name: `file${i}`, 
      maxCount: 1 
    }));

    const upload = multer({
      storage,
      limits: { fileSize: 50 * 1024 * 1024 }, // 10MB per file
      fileFilter: getFileFilter("templates"),
    }).fields(fieldConfig);

    upload(req, res, (err) => {
      if (err) return res.status(400).json({ message: err.message });
      next();
    });
  } catch (error) {
    res.status(500).json({ message: "Error in template files upload configuration." });
  }
};

module.exports = { 
  uploadProfileImage, 
  uploadFiles, 
  uploadSiteImages, 
  uploadCertificateTemplate, 
  uploadTemplateFiles
};