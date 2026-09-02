const Review = require("./review.model");
const Task = require("../task/task.model");
const Escrow = require("../escrow/escrow.model");
const User = require("../auth/auth.model");
const {
  updateProviderBadges
} = require("../badge/badge.service");

const updateProviderRating = async (providerId) => {
  const reviews = await Review.find({
    provider: providerId
  }).select("rating");

  const count = reviews.length;
  const total = reviews.reduce(
    (sum, review) => sum + review.rating,
    0
  );

  const average =
    count === 0
      ? 0
      : Number((total / count).toFixed(2));

  await User.findByIdAndUpdate(
    providerId,
    {
      $set: {
        "rating.average": average,
        "rating.count": count
      }
    }
  );
};

const createReview = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { rating, comment = "" } = req.body;

    if (
      !Number.isInteger(Number(rating)) ||
      Number(rating) < 1 ||
      Number(rating) > 5
    ) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5"
      });
    }

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    if (task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Only the customer can review this service"
      });
    }

    if (task.status !== "completed") {
      return res.status(400).json({
        message: "Review is available only after completion"
      });
    }

    const escrow = await Escrow.findOne({
      task: task._id,
      owner: req.user.id
    }).sort({ createdAt: -1 });

    if (!escrow || !escrow.worker) {
      return res.status(400).json({
        message: "No provider is associated with this task"
      });
    }

    const existing = await Review.findOne({
      task: task._id,
      customer: req.user.id
    });

    if (existing) {
      return res.status(409).json({
        message: "You have already reviewed this service"
      });
    }

    const review = await Review.create({
      task: task._id,
      customer: req.user.id,
      provider: escrow.worker,
      rating: Number(rating),
      comment: String(comment).trim()
    });

    await updateProviderRating(escrow.worker);
    await updateProviderBadges(escrow.worker);

    return res.status(201).json({
      message: "Review submitted successfully",
      review
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to submit review",
      error: error.message
    });
  }
};

const getProviderReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      provider: req.params.userId
    })
      .populate("customer", "name profileImage")
      .populate("task", "title")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: reviews.length,
      reviews
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load reviews",
      error: error.message
    });
  }
};

module.exports = {
  createReview,
  updateProviderRating,
  getProviderReviews
};
