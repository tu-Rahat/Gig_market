const express = require("express");
const protect = require(
  "../../middleware/authMiddleware"
);
const {
  getMyProfile,
  getPublicProfile,
  saveMyProfile,
  getProviderPortfolio
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

router.get(
  "/:userId",
  getPublicProfile
);

router.get(
 "/:userId/portfolio",
 getProviderPortfolio
);

module.exports = router;