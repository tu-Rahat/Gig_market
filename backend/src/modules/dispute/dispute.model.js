const mongoose = require("mongoose");

const disputeSchema = new mongoose.Schema(
    {
        // The task involved in the dispute
        task: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
            required: true,
            index: true
        },

        // The payment/escrow involved
        escrow: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Escrow",
            required: true,
            index: true
        },

        // Customer or worker who opened the dispute
        raisedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        // Task owner / customer
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        // Selected worker / provider
        worker: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        // Short category/reason
        reason: {
            type: String,
            required: [true, "Dispute reason is required"],
            trim: true,
            maxlength: [
                150,
                "Dispute reason cannot exceed 150 characters"
            ]
        },

        // Detailed explanation
        description: {
            type: String,
            required: [true, "Dispute description is required"],
            trim: true,
            maxlength: [
                3000,
                "Dispute description cannot exceed 3000 characters"
            ]
        },

        // Supporting files
        evidence: [
            {
                originalName: {
                    type: String,
                    default: ""
                },

                storedName: {
                    type: String,
                    default: ""
                },

                mimeType: {
                    type: String,
                    default: ""
                },

                filePath: {
                    type: String,
                    default: ""
                },

                fileSize: {
                    type: Number,
                    default: 0
                }
            }
        ],

        // Current dispute state
        status: {
            type: String,
            enum: [
                "open",
                "under_review",
                "resolved",
                "rejected"
            ],
            default: "open",
            index: true
        },

        // Final decision made by administrator
        adminDecision: {
            type: String,
            enum: [
                "owner_favor",
                "worker_favor",
                "partial_resolution",
                "no_violation",
                ""
            ],
            default: ""
        },

        // Admin explanation
        adminNote: {
            type: String,
            default: "",
            trim: true,
            maxlength: [
                3000,
                "Admin note cannot exceed 3000 characters"
            ]
        },

        // When administrator resolves the dispute
        resolvedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);


// Helps find disputes belonging to an escrow
disputeSchema.index({
    escrow: 1,
    status: 1
});


const Dispute = mongoose.model(
    "Dispute",
    disputeSchema
);


module.exports = Dispute;