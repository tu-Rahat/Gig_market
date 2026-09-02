const express = require("express");

const protect = require(
    "../../middleware/authMiddleware"
);

const uploadDisputeEvidence = require(
    "./dispute.upload"
);

const {
    createDispute,
    getMyDisputes,
    getDisputeById,
    getPendingDisputes,
    resolveDispute
} = require(
    "./dispute.controller"
);

const requireAdmin = require(
    "../admin/admin.middleware"
);


const router = express.Router();


// =====================================================
// USER ROUTES
// =====================================================

// Raise a dispute
// Customer or worker
router.post(
    "/",
    protect,
    uploadDisputeEvidence.array(
        "evidence",
        5
    ),
    createDispute
);


// Get disputes involving logged-in user
router.get(
    "/mine",
    protect,
    getMyDisputes
);


// Get one dispute
router.get(
    "/:id",
    protect,
    getDisputeById
);


// =====================================================
// ADMIN ROUTES
// =====================================================

// Get open / under-review disputes
router.get(
    "/admin/pending",
    requireAdmin,
    getPendingDisputes
);


// Resolve dispute
router.patch(
    "/admin/:id/resolve",
    requireAdmin,
    resolveDispute
);


module.exports = router;