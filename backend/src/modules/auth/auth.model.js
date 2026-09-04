const mongoose = require("mongoose");
const encryptedValueSchema =
    new mongoose.Schema(
        {
            algorithm: {
                type: String,
                required: true
            },

            padding: {
                type: String,
                required: true
            },

            encoding: {
                type: String,
                required: true
            },

            modulusByteLength: {
                type: Number,
                required: true
            },

            blockSize: {
                type: Number,
                required: true
            },

            blocks: {
                type: [String],
                required: true
            },

            originalType: {
                type: String,
                required: true
            }
        },
        {
            _id: false
        }
    );

const userSchema = new mongoose.Schema(
    {
        name: {
            type: encryptedValueSchema,
            required: true
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
            type: encryptedValueSchema,
            default: null
        },

        bio: {
            type: encryptedValueSchema,
            default: null
        },

        skills: {
            type: encryptedValueSchema,
            default: null
        },

        experience: {
            type: encryptedValueSchema,
            default: null
        },

        certifications: {
            type: encryptedValueSchema,
            default: null
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
        },

        location: {
            latitude: {
                type: Number,
                min: -90,
                max: 90
            },
            longitude: {
                type: Number,
                min: -180,
                max: 180
            }
        },

        isAvailable: {
            type: Boolean,
            default: true
        }
    },

    {
        timestamps: true
    }
);


const User = mongoose.model("User", userSchema);


module.exports = User;