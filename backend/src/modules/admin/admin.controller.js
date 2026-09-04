const jwt = require("jsonwebtoken");
const {
    setAdminSession,
    clearAdminSession
} = require("../../middleware/sessionCookies");

const {
    getRSAPrivateKey
} = require("../../crypto/rsa/rsa.keyProvider");

const {
    decryptUserData
} = require("../../crypto/rsa/user.rsa");

const DEV_RSA_KEY_ID = "dev-rsa-key";

const Credential = require(
    "../credential/credential.model"
);
const {
    updateProviderBadges
} = require("../badge/badge.service");


const adminLogin = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        const submittedEmail = String(
            email || ""
        )
            .trim()
            .toLowerCase();

        const submittedPassword = String(
            password || ""
        ).trim();

        const adminEmail = String(
            process.env.ADMIN_EMAIL || ""
        )
            .trim()
            .toLowerCase();

        const adminPassword = String(
            process.env.ADMIN_PASSWORD || ""
        ).trim();

        if (
            submittedEmail !== adminEmail ||
            submittedPassword !== adminPassword
        ) {
            return res.status(401).json({
                message:
                    "Invalid admin credentials"
            });
        }

        const token = jwt.sign(
            {
                email:
                    process.env.ADMIN_EMAIL,
                role: "admin"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        setAdminSession(res, token);

        return res.status(200).json({
            message:
                "Admin login successful",

            admin: {
                email:
                    process.env.ADMIN_EMAIL,

                role: "admin"
            }
        });
    } catch (error) {
        return res.status(500).json({
            message:
                "Admin login failed",

            error: error.message
        });
    }
};


const adminLogout = (req, res) => {
    clearAdminSession(res);
    return res.status(200).json({ message: "Admin logout successful" });
};

const getPendingCredentials = async (
    req,
    res
) => {
    try {
        const credentials =
            await Credential.find({
                verificationStatus:
                    "pending"
            })
                .populate(
                    "owner",
                    "name email"
                )
                .sort({
                    verificationRequestedAt: 1
                });

        const privateKey =
            await getRSAPrivateKey(
                DEV_RSA_KEY_ID
            );

        for (const credential of credentials) {
            if (
                credential.owner &&
                credential.owner.name &&
                typeof credential.owner.name === "object"
            ) {
                const decrypted =
                    await decryptUserData(
                        {
                            name: credential.owner.name
                        },
                        privateKey
                    );

                credential.owner.name =
                    decrypted.name;
            }
        }

        return res.status(200).json({
            credentials
        });

    } catch (error) {
        return res.status(500).json({
            message:
                "Failed to load pending credentials",

            error: error.message
        });
    }
};


const approveCredential = async (
    req,
    res
) => {
    try {
        const credential =
            await Credential.findById(
                req.params.id
            );

        if (!credential) {
            return res.status(404).json({
                message:
                    "Credential not found"
            });
        }

        if (
            credential.verificationStatus !==
            "pending"
        ) {
            return res.status(400).json({
                message:
                    "Only pending credentials can be verified"
            });
        }

        credential.verificationStatus =
            "verified";

        credential.rejectionReason = "";

        credential.verifiedAt =
            new Date();

        if (
            "verifiedByAdmin"
            in credential
        ) {
            credential.verifiedByAdmin =
                req.admin.email;
        }

        await credential.save();
        await updateProviderBadges(
            credential.owner
        );

        return res.status(200).json({
            message:
                "Credential verified successfully",

            credential
        });
    } catch (error) {
        return res.status(500).json({
            message:
                "Failed to verify credential",

            error: error.message
        });
    }
};


const rejectCredential = async (
    req,
    res
) => {
    try {
        const {
            reason
        } = req.body;

        if (
            !reason ||
            !reason.trim()
        ) {
            return res.status(400).json({
                message:
                    "Rejection reason is required"
            });
        }

        const credential =
            await Credential.findById(
                req.params.id
            );

        if (!credential) {
            return res.status(404).json({
                message:
                    "Credential not found"
            });
        }

        if (
            credential.verificationStatus !==
            "pending"
        ) {
            return res.status(400).json({
                message:
                    "Only pending credentials can be rejected"
            });
        }

        credential.verificationStatus =
            "rejected";

        credential.rejectionReason =
            reason.trim();

        credential.verifiedAt = null;

        if (
            "verifiedByAdmin"
            in credential
        ) {
            credential.verifiedByAdmin = "";
        }

        await credential.save();

        return res.status(200).json({
            message:
                "Credential rejected",

            credential
        });
    } catch (error) {
        return res.status(500).json({
            message:
                "Failed to reject credential",

            error: error.message
        });
    }
};


module.exports = {
    adminLogin,
    adminLogout,
    getPendingCredentials,
    approveCredential,
    rejectCredential
};