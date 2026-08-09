const mongoose = require("mongoose");
const credentialSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    credentialType: {
      type: String,
      required: true,
      enum: [
        "certificate",
        "license",
        "experience"
      ],
      index: true
    },
    title: {
      type: String,
      required: [true, "Credential title is required"],
      trim: true,
      maxlength: [
        150,
        "Credential title cannot exceed 150 characters"
      ]
    },
    issuer: {
      type: String,
      default: "",
      trim: true,
      maxlength: [
        150,
        "Issuer cannot exceed 150 characters"
      ]
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: [
        2000,
        "Description cannot exceed 2000 characters"
      ]
    },
    issuedDate: {
      type: Date,
      default: null
    },
    document: {
      originalName: {
        type: String,
        required: true
      },
      storedName: {
        type: String,
        required: true
      },
      mimeType: {
        type: String,
        required: true
      },
      filePath: {
        type: String,
        required: true
      },
      fileSize: {
        type: Number,
        required: true
      }
    },
    verificationStatus: {
      type: String,
      enum: [
        "not_submitted",
        "pending",
        "verified",
        "rejected"
      ],
      default: "not_submitted",
      index: true
    },
    verificationRequestedAt: {
      type: Date,
      default: null
    },
    verifiedAt: {
      type: Date,
      default: null
    },
    rejectionReason: {
      type: String,
      default: "",
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const Credential = mongoose.model(
  "Credential",
  credentialSchema
);

module.exports = Credential;