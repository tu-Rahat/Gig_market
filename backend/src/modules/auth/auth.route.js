const express = require("express");

const protect = require("../../middleware/authMiddleware");

const router = express.Router();


const {
    registerUser,
    loginUser,
    logoutUser,
    getProfile
} = require("./auth.controller");


// Public Routes
router.post("/register", registerUser);

router.post("/login", loginUser);
router.post("/logout", logoutUser);


// Protected Route
router.get(
    "/profile",
    protect,
    getProfile
);


module.exports = router;