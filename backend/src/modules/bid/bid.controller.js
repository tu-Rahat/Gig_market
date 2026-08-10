const Bid = require("./bid.model");
const Task = require("../task/task.model");

// Feature 4: submit first bid or lower an existing bid
const submitOrLowerBid = async (req, res) => {
    try {
        const {
            amount,
            message = ""
        } = req.body;

        const numericAmount = Number(amount);

        if (
            Number.isNaN(numericAmount) ||
            numericAmount <= 0
        ) {
            return res.status(400).json({
                message: "Bid amount must be greater than 0"
            });
        }

        const task = await Task.findById(
            req.params.taskId
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        if (task.status !== "open") {
            return res.status(400).json({
                message: "Bidding is only available for open advertisements"
            });
        }

        if (
            task.createdBy.toString() ===
            req.user.id
        ) {
            return res.status(400).json({
                message: "You cannot bid on your own advertisement"
            });
        }

        let bid = await Bid.findOne({
            task: task._id,
            bidder: req.user.id
        });

        if (bid) {
            if (bid.status !== "active") {
                return res.status(400).json({
                    message: "This bid can no longer be changed"
                });
            }

            if (numericAmount >= bid.amount) {
                return res.status(400).json({
                    message: "In reverse bidding, your new bid must be lower than your current bid"
                });
            }

            bid.amount = numericAmount;
            bid.message = message.trim();
            await bid.save();

            await bid.populate(
                "bidder",
                "name"
            );

            return res.status(200).json({
                message: "Bid lowered successfully",
                bid
            });
        }

        bid = await Bid.create({
            task: task._id,
            bidder: req.user.id,
            amount: numericAmount,
            message: message.trim()
        });

        await bid.populate(
            "bidder",
            "name"
        );

        return res.status(201).json({
            message: "Bid submitted successfully",
            bid
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: "You already have a bid for this task"
            });
        }
        return res.status(500).json({
            message: "Failed to submit bid",
            error: error.message
        });
    }
};

// Feature 4 summary.
// This is intentionally NOT the full live ranking from Feature 5.
const getBidSummary = async (req, res) => {
    try {
        const task = await Task.findById(
            req.params.taskId
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        const activeBids = await Bid.find({
            task: task._id,
            status: "active"
        })
        .select("amount bidder")
        .sort({
            amount: 1,
            createdAt: 1
        });

        const lowestBid = activeBids.length > 0
            ? activeBids[0].amount
            : null;

        const myBid = await Bid.findOne({
            task: task._id,
            bidder: req.user.id
        }).select(
            "amount status message updatedAt"
        );

        return res.status(200).json({
            taskId: task._id,
            bidCount: activeBids.length,
            lowestBid,
            myBid
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to load bid summary",
            error: error.message
        });
    }
};

// Owner can see bids on their own task.
// This supports later worker selection but does not select anyone.
const getOwnerTaskBids = async (req, res) => {
    try {
        const task = await Task.findById(
            req.params.taskId
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        if (
            task.createdBy.toString() !==
            req.user.id
        ) {
            return res.status(403).json({
                message: "Only the task owner can view these bids"
            });
        }

        const bids = await Bid.find({
            task: task._id,
            status: "active"
        })
        .populate(
            "bidder",
            "name email"
        )
        .sort({
            amount: 1,
            createdAt: 1
        });

        return res.status(200).json({
            count: bids.length,
            bids
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to load task bids",
            error: error.message
        });
    }
};

module.exports = {
    submitOrLowerBid,
    getBidSummary,
    getOwnerTaskBids
};