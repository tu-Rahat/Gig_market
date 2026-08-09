const express = require("express");
const protect = require("../../middleware/authMiddleware");
const {
 createEscrowHold,
 getMyEscrows,
 getEscrowById
} = require("./escrow.controller");
const router = express.Router();
router.get(
 "/mine",
 protect,
 getMyEscrows
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
module.exports = router;