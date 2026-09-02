const fs = require("fs");

const Dispute = require("./dispute.model");
const Escrow = require("../escrow/escrow.model");
const Task = require("../task/task.model");


// Remove uploaded files when a request fails
const removeUploadedFiles = (files = []) => {
    files.forEach((file) => {
        if (file?.path) {
            fs.unlink(file.path, () => {});
        }
    });
};


// Convert uploaded files into our database format
const buildEvidence = (files = []) => {
    return files.map((file) => ({
        originalName: file.originalname || "",
        storedName: file.filename || "",
        mimeType: file.mimetype || "",
        filePath: file.path || "",
        fileSize: file.size || 0
    }));
};


// =====================================================
// Feature 20: Create Dispute
// Customer or Worker can raise a dispute
// =====================================================

const createDispute = async (req, res) => {

    try {

        const {
            escrowId,
            reason,
            description
        } = req.body;


        if (!escrowId) {

            removeUploadedFiles(req.files);

            return res.status(400).json({
                message: "Escrow ID is required"
            });

        }


        if (!reason || !reason.trim()) {

            removeUploadedFiles(req.files);

            return res.status(400).json({
                message: "Dispute reason is required"
            });

        }


        if (!description || !description.trim()) {

            removeUploadedFiles(req.files);

            return res.status(400).json({
                message: "Dispute description is required"
            });

        }


        // Find the escrow
        const escrow = await Escrow.findById(
            escrowId
        );


        if (!escrow) {

            removeUploadedFiles(req.files);

            return res.status(404).json({
                message: "Escrow record not found"
            });

        }


        const userId = req.user.id;


        // Only the customer or selected worker
        // can create a dispute
        const isOwner =
            escrow.owner.toString() === userId;

        const isWorker =
            escrow.worker.toString() === userId;


        if (!isOwner && !isWorker) {

            removeUploadedFiles(req.files);

            return res.status(403).json({
                message:
                    "Only the customer or assigned worker can raise a dispute"
            });

        }


        // A released/refunded escrow should not
        // create a new active dispute
        if (
            escrow.status === "released" ||
            escrow.status === "refunded"
        ) {

            removeUploadedFiles(req.files);

            return res.status(400).json({
                message:
                    "A dispute cannot be opened for a released or refunded payment"
            });

        }


        // Prevent multiple active disputes
        // for the same escrow
        const existingDispute =
            await Dispute.findOne({
                escrow: escrow._id,
                status: {
                    $in: [
                        "open",
                        "under_review"
                    ]
                }
            });


        if (existingDispute) {

            removeUploadedFiles(req.files);

            return res.status(400).json({
                message:
                    "An active dispute already exists for this payment"
            });

        }


        // Verify the task still exists
        const task = await Task.findById(
            escrow.task
        );


        if (!task) {

            removeUploadedFiles(req.files);

            return res.status(404).json({
                message: "Associated task not found"
            });

        }


        // Build evidence list
        const evidence =
            buildEvidence(req.files);


        // Create dispute
        const dispute =
            await Dispute.create({

                task: escrow.task,

                escrow: escrow._id,

                raisedBy: userId,

                owner: escrow.owner,

                worker: escrow.worker,

                reason:
                    reason.trim(),

                description:
                    description.trim(),

                evidence

            });


        // Freeze the escrow from normal release
        escrow.status = "disputed";

        await escrow.save();


        await dispute.populate(
            "task",
            "title status location"
        );


        await dispute.populate(
            "raisedBy",
            "name email"
        );


        await dispute.populate(
            "owner",
            "name email"
        );


        await dispute.populate(
            "worker",
            "name email"
        );


        await dispute.populate(
            "escrow",
            "amount currency status paymentReference"
        );


        return res.status(201).json({

            message:
                "Dispute raised successfully",

            dispute

        });

    } catch (error) {

        removeUploadedFiles(req.files);

        return res.status(500).json({

            message:
                "Failed to create dispute",

            error:
                error.message

        });

    }

};



// =====================================================
// Get My Disputes
// Customer or Worker
// =====================================================

const getMyDisputes = async (req, res) => {

    try {

        const disputes =
            await Dispute.find({

                $or: [
                    {
                        owner:
                            req.user.id
                    },
                    {
                        worker:
                            req.user.id
                    }
                ]

            })
            .populate(
                "task",
                "title status location"
            )
            .populate(
                "raisedBy",
                "name email"
            )
            .populate(
                "owner",
                "name"
            )
            .populate(
                "worker",
                "name"
            )
            .populate(
                "escrow",
                "amount currency status paymentReference"
            )
            .sort({
                createdAt: -1
            });


        return res.status(200).json({

            count:
                disputes.length,

            disputes

        });

    } catch (error) {

        return res.status(500).json({

            message:
                "Failed to load disputes",

            error:
                error.message

        });

    }

};



// =====================================================
// Get One Dispute
// Customer or Worker
// =====================================================

const getDisputeById = async (req, res) => {

    try {

        const dispute =
            await Dispute.findById(
                req.params.id
            )
            .populate(
                "task",
                "title status location description"
            )
            .populate(
                "raisedBy",
                "name email"
            )
            .populate(
                "owner",
                "name email"
            )
            .populate(
                "worker",
                "name email"
            )
            .populate(
                "escrow",
                "amount currency status paymentReference completionDeadline approvalDeadline releasedAt refundedAt"
            );


        if (!dispute) {

            return res.status(404).json({

                message:
                    "Dispute not found"

            });

        }


        const userId =
            req.user.id;


        const hasAccess =
            dispute.owner._id.toString() === userId ||
            dispute.worker._id.toString() === userId;


        if (!hasAccess) {

            return res.status(403).json({

                message:
                    "You do not have access to this dispute"

            });

        }


        return res.status(200).json({

            dispute

        });

    } catch (error) {

        return res.status(500).json({

            message:
                "Failed to load dispute",

            error:
                error.message

        });

    }

};



// =====================================================
// Admin: Get Pending Disputes
// =====================================================

const getPendingDisputes = async (req, res) => {

    try {

        const disputes =
            await Dispute.find({

                status: {
                    $in: [
                        "open",
                        "under_review"
                    ]
                }

            })
            .populate(
                "task",
                "title status location"
            )
            .populate(
                "raisedBy",
                "name email"
            )
            .populate(
                "owner",
                "name email"
            )
            .populate(
                "worker",
                "name email"
            )
            .populate(
                "escrow",
                "amount currency status paymentReference completionDeadline approvalDeadline"
            )
            .sort({
                createdAt: 1
            });


        return res.status(200).json({

            count:
                disputes.length,

            disputes

        });

    } catch (error) {

        return res.status(500).json({

            message:
                "Failed to load pending disputes",

            error:
                error.message

        });

    }

};



// =====================================================
// Admin: Resolve Dispute
// =====================================================

const resolveDispute = async (req, res) => {

    try {

        const {
            decision,
            adminNote = ""
        } = req.body;


        const allowedDecisions = [
            "owner_favor",
            "worker_favor",
            "partial_resolution",
            "no_violation"
        ];


        if (
            !allowedDecisions.includes(
                decision
            )
        ) {

            return res.status(400).json({

                message:
                    "Invalid dispute decision"

            });

        }


        const dispute =
            await Dispute.findById(
                req.params.id
            );


        if (!dispute) {

            return res.status(404).json({

                message:
                    "Dispute not found"

            });

        }


        if (
            dispute.status === "resolved" ||
            dispute.status === "rejected"
        ) {

            return res.status(400).json({

                message:
                    "This dispute has already been resolved"

            });

        }


        const escrow =
            await Escrow.findById(
                dispute.escrow
            );


        if (!escrow) {

            return res.status(404).json({

                message:
                    "Associated escrow not found"

            });

        }


        // The dispute must still control
        // a disputed escrow
        if (
            escrow.status !== "disputed"
        ) {

            return res.status(400).json({

                message:
                    "This escrow is not currently under dispute"

            });

        }


        // ==========================================
        // Admin decision
        // ==========================================

        if (
            decision === "worker_favor"
        ) {

            // Worker wins.
            // Release payment to worker.
            escrow.status =
                "released";

            escrow.releasedAt =
                new Date();

            escrow.releaseReason =
                "dispute_worker_favor";

            dispute.status =
                "resolved";

        } else if (
            decision === "owner_favor"
        ) {

            // Customer wins.
            // Refund payment to customer.
            escrow.status =
                "refunded";

            escrow.refundedAt =
                new Date();

            dispute.status =
                "resolved";

        } else if (
            decision === "partial_resolution"
        ) {

            // We do not have a partial-payment
            // field in the current Escrow model.
            //
            // Keep the escrow disputed until
            // partial settlement is implemented.
            dispute.status =
                "under_review";

            return res.status(400).json({

                message:
                    "Partial resolution requires a settlement amount. This option is not enabled yet."

            });

        } else if (
            decision === "no_violation"
        ) {

            // No party is considered at fault.
            // Keep payment protected and close
            // the dispute.
            dispute.status =
                "resolved";

            escrow.status =
                "refunded";

            escrow.refundedAt =
                new Date();

        }


        dispute.adminDecision =
            decision;

        dispute.adminNote =
            adminNote.trim();

        dispute.resolvedAt =
            new Date();


        await dispute.save();

        await escrow.save();


        await dispute.populate(
            "task",
            "title status"
        );

        await dispute.populate(
            "owner",
            "name email"
        );

        await dispute.populate(
            "worker",
            "name email"
        );

        await dispute.populate(
            "raisedBy",
            "name email"
        );

        await dispute.populate(
            "escrow",
            "amount currency status paymentReference releasedAt refundedAt"
        );


        return res.status(200).json({

            message:
                "Dispute resolved successfully",

            dispute

        });

    } catch (error) {

        return res.status(500).json({

            message:
                "Failed to resolve dispute",

            error:
                error.message

        });

    }

};


module.exports = {

    createDispute,

    getMyDisputes,

    getDisputeById,

    getPendingDisputes,

    resolveDispute

};