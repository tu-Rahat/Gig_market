const mongoose = require("mongoose");


const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        profileImage: {
            type: String,
            default: ""
        },

        bio: {
            type: String,
            default: ""
        },

        skills: {
            type: [String],
            default: []
        },

        experience: {
            type: String,
            default: ""
        },

        certifications: {
            type: [String],
            default: []
        },

        badges: {
            type: [
                {
                    type: {
                        type: String,
                        enum: [
                            "verified_provider",
                            "top_rated",
                            "expert_professional"
                        ]
                    },
                    name: {
                        type: String
                    },
                    awardedAt: {
                        type: Date,
                        default: Date.now
                    }
                }
            ],
            default: []
        },

        rating: {
            average: {
                type: Number,
                default: 0
            },

            count: {
                type: Number,
                default: 0
            }
        },

        completedJobs: {
            type: Number,
            default: 0
        }
    },

    {
        timestamps: true
    }
);


const User = mongoose.model("User", userSchema);


module.exports = User;