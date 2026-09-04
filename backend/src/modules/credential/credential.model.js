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
      type: mongoose.Schema.Types.Mixed,
      required: [true, "Credential title is required"]
    },
    issuer: {
      type: mongoose.Schema.Types.Mixed,
      default: ""
    },
    description: {
      type: mongoose.Schema.Types.Mixed,
      default: ""
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
    verifiedByAdmin: {
    type: String,
    default: ""
    },
    rejectionReason: {
      type: String,
      default: "",
      trim: true
    },
    __protected: {
      type: mongoose.Schema.Types.Mixed,
      default: undefined,
      select: false
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