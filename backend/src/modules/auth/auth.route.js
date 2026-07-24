const express = require("express");

const protect = require("../../middleware/authMiddleware");

const router = express.Router();


const {
    registerUser,
    loginUser
} = require("./auth.controller");


// Public Routes
router.post("/register", registerUser);

router.post("/login", loginUser);


// Protected Route
router.get("/profile", protect, (req, res) => {

    res.json({
        message: "Profile accessed successfully",
        user: req.user
    });

});


module.exports = router;