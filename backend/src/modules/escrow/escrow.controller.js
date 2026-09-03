const crypto = require("crypto");
const Escrow = require("./escrow.model");
const Task = require("../task/task.model");
const User = require("../auth/auth.model");
const createPaymentReference = () => {
 return `ESC-${Date.now()}-${crypto
 .randomBytes(4)
 .toString("hex")
 .toUpperCase()}`;
};
// Feature 15: create a simulated escrow hold
const createEscrowHold = async (req, res) => {
 try {
 const {
    taskId,
    amount,
    completionDeadline
} = req.body;

if (
    !taskId ||
    amount === undefined ||
    !completionDeadline
) {
    return res.status(400).json({
        message:
            "Task, amount, and completion deadline are required"
    });
}
 const numericAmount = Number(amount);
 if (
 Number.isNaN(numericAmount) ||
 numericAmount <= 0
 ) {
 return res.status(400).json({
 message: "Escrow amount must be greater than 0"
 });
 }
 const deadline = new Date(completionDeadline);
 if (Number.isNaN(deadline.getTime())) {
 return res.status(400).json({
 message: "Completion deadline is invalid"
 });
 }
 if (deadline <= new Date()) {
 return res.status(400).json({
 message: "Completion deadline must be in the future"
 });
 }
 const task = await Task.findById(taskId);
 if (!task) {
 return res.status(404).json({
 message: "Task not found"
 });
 }
if (!task.selectedWorker) {
    return res.status(400).json({
        message:
            "Please select a provider before creating the escrow"
    });
}

const selectedWorkerId = task.selectedWorker.toString();
 if (selectedWorkerId === req.user.id) {
 return res.status(400).json({
 message:
 "Task owner cannot be selected as the worker"
 });
 }
 const worker = await User.findById(selectedWorkerId);
 if (!worker) {
 return res.status(404).json({
 message: "Selected worker not found"
 });
 }
 const existingHeldEscrow = await Escrow.findOne({
 task: task._id,
 status: "held"
 });
 if (existingHeldEscrow) {
 return res.status(400).json({
 message:
 "This task already has an active escrow hold"
 });
 }
 const escrow = await Escrow.create({
 task: task._id,
 owner: req.user.id,
 worker: worker._id,
 amount: numericAmount,
 paymentReference: createPaymentReference(),
 completionDeadline: deadline
 });
 // This is safe for the current task schema.
 // Later Worker Selection can perform the same transition.
 if (task.status === "open") {
 task.status = "in_progress";
 await task.save();
 }
 await escrow.populate("task", "title status");
 await escrow.populate("owner", "name email");
 await escrow.populate("worker", "name email");
 return res.status(201).json({
 message:
 "Demo payment held successfully in escrow",
 escrow
 });
 } catch (error) {
 return res.status(500).json({
 message: "Failed to create escrow hold",
 error: error.message
 });
 }
};
// Supporting endpoint: escrow records involving logged-in user
// Get tasks owned by the logged-in user that have a selected worker
const getEligibleEscrowTasks = async (req, res) => {
    try {
        const tasks = await Task.find({
            createdBy: req.user.id,
            selectedWorker: { $ne: null },
            bookingStatus: "confirmed"
        })
            .populate("selectedWorker", "name email rating completedJobs")
            .populate("category", "name")
            .sort({ updatedAt: -1 });

        return res.status(200).json({
            tasks
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to load eligible escrow tasks",
            error: error.message
        });
    }
};

const getMyEscrows = async (req, res) => {
 try {
 const escrows = await Escrow.find({
 $or: [
 { owner: req.user.id },
 { worker: req.user.id }
 ]
 })
 .populate("task", "title status")
 .populate("owner", "name")
 .populate("worker", "name")
 .sort({ createdAt: -1 });
 return res.status(200).json({
 count: escrows.length,
 escrows
 });
 } catch (error) {
    return res.status(500).json({
 message: "Failed to load escrow records",
 error: error.message
 });
 }
};
// Supporting endpoint: one escrow record
const getEscrowById = async (req, res) => {
 try {
 const escrow = await Escrow.findById(req.params.id)
 .populate("task", "title status")
 .populate("owner", "name")
 .populate("worker", "name");
 if (!escrow) {
 return res.status(404).json({
 message: "Escrow record not found"
 });
 }
 const userId = req.user.id;
 if (
 escrow.owner._id.toString() !== userId &&
 escrow.worker._id.toString() !== userId
 ) {
 return res.status(403).json({
 message:
 "You do not have access to this escrow record"
 });
 }
 return res.status(200).json({
 escrow
 });
 } catch (error) {
 return res.status(500).json({
 message: "Failed to load escrow record",
 error: error.message
 });
 }
};

// Feature 19: owner manually releases payment
const releaseEscrowPayment = async (req, res) => {
    try {

        const escrow =
            await Escrow.findById(
                req.params.id
            );

        if (!escrow) {
            return res.status(404).json({
                message:
                    "Escrow record not found"
            });
        }

        // Only the task owner can release
        // the payment.
        if (
            escrow.owner.toString() !==
            req.user.id
        ) {
            return res.status(403).json({
                message:
                    "Only the task owner can release this payment"
            });
        }

        // Payment must still be held.
        if (
            escrow.status !== "held"
        ) {
            return res.status(400).json({
                message:
                    "Payment is no longer held in escrow"
            });
        }

        // Work must have reached the
        // completed stage.
        const task =
            await Task.findById(
                escrow.task
            );

        if (!task) {
            return res.status(404).json({
                message:
                    "Associated task not found"
            });
        }

        if (
            task.status !== "completed"
        ) {
            return res.status(400).json({
                message:
                    "Payment can only be released after the task is completed"
            });
        }

        escrow.status =
            "released";

        escrow.releasedAt =
            new Date();

        escrow.releaseReason =
            "customer_approved";

        await escrow.save();

        return res.status(200).json({

            message:
                "Payment released successfully",

            escrow

        });

    } catch (error) {

        return res.status(500).json({

            message:
                "Failed to release payment",

            error:
                error.message

        });

    }
};



module.exports = {
    createEscrowHold,
    getEligibleEscrowTasks,
    getMyEscrows,
    getEscrowById,
    releaseEscrowPayment
};
