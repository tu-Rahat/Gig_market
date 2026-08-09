const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDirectory = path.join(
  process.cwd(),
  "uploads",
  "credentials"
);

fs.mkdirSync(uploadDirectory, {
  recursive: true
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9._-]/g, "");
    const uniqueName =
      `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}-${safeName}`;
    cb(null, uniqueName);
  }
});

const allowedMimeTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]);

const fileFilter = (req, file, cb) => {
  if (!allowedMimeTypes.has(file.mimetype)) {
    return cb(
      new Error(
        "Only PDF, JPG, PNG, DOC, and DOCX files are allowed"
      )
    );
  }
  cb(null, true);
};

const uploadCredential = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

module.exports = uploadCredential;