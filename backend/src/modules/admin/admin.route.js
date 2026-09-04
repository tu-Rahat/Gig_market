const express = require("express");

const {
    adminLogin,
    adminLogout,
    getPendingCredentials,
    approveCredential,
    rejectCredential
} = require("./admin.controller");

const requireAdmin = require(
    "./admin.middleware"
);

const router = express.Router();


// Admin login
router.post(
    "/login",
    adminLogin
);

router.post("/logout", adminLogout);


// Get all pending credential requests
router.get(
    "/credentials/pending",
    requireAdmin,
    getPendingCredentials
);


// Approve credential
router.patch(
    "/credentials/:id/approve",
    requireAdmin,
    approveCredential
);


// Reject credential
router.patch(
    "/credentials/:id/reject",
    requireAdmin,
    rejectCredential
);


module.exports = router;