const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    organization: {
      type: String,
      default: "",
      trim: true,
      maxlength: 150
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000
    },
    startDate: {
      type: Date,
      default: null
    },
    endDate: {
      type: Date,
      default: null
    }
  },
  {
    _id: true
  }
);

const workerProfileSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true
    },
    headline: {
      type: String,
      default: "",
      trim: true,
      maxlength: 150
    },
    bio: {
      type: String,
      default: "",
      trim: true,
      maxlength: 2000
    },
    skills: {
      type: [
        {
          type: String,
          trim: true
        }
      ],
      default: []
    },
    experience: {
      type: [experienceSchema],
      default: []
    },
    portfolio: {
      type: [
        {
          title: {
            type: String,
            trim: true,
            maxlength: 150
          },
          description: {
            type: String,
            trim: true,
            maxlength: 2000
          },
          imageUrl: {
            type: String,
            default: ""
          },
          completedAt: {
            type: Date,
            default: null
          }
        }
      ],
      default: []
    }
  },
  {
    timestamps: true
  }
);

const WorkerProfile = mongoose.model(
  "WorkerProfile",
  workerProfileSchema
);

module.exports = WorkerProfile;