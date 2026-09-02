const mongoose = require(
  "mongoose"
);
const reviewSchema =
  new mongoose.Schema(
    {
      task: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Task",
        required: true,
        index: true
      },
      customer: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
      },
      provider: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      comment: {
        type: String,
        default: "",
        trim: true,
        maxlength: 2000
      }
    },
    {
      timestamps: true
    }
  );
reviewSchema.index(
  {
    task: 1,
    customer: 1
  },
  {
    unique: true
  }
);
module.exports =
  mongoose.model(
    "Review",
    reviewSchema
    );