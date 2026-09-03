const express = require("express");
const protect = require("../../middleware/authMiddleware");
const {
    createEscrowHold,
    getEligibleEscrowTasks,
    getMyEscrows,
    getEscrowById,
    releaseEscrowPayment
} = require("./escrow.controller");
const router = express.Router();
router.get(
 "/mine",
 protect,
 getMyEscrows
);
router.get(
    "/eligible-tasks",
    protect,
    getEligibleEscrowTasks
);
router.get(
 "/:id",
 protect,
 getEscrowById
);
router.post(
 "/hold",
 protect,
 createEscrowHold
); 

router.patch(
    "/:id/release",
    protect,
    releaseEscrowPayment
);

module.exports = router;