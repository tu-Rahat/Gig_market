const express = require("express");
const protect = require(
  "../../middleware/authMiddleware"
);
const {
  getMyProfile,
  getPublicProfile,
  saveMyProfile
} = require(
  "./workerProfile.controller"
);

const router = express.Router();

router.get(
  "/mine",
  protect,
  getMyProfile
);

router.put(
  "/mine",
  protect,
  saveMyProfile
);

// Public showcase route.
// Keep this after /mine.
router.get(
  "/:userId",
  getPublicProfile
);

module.exports = router;