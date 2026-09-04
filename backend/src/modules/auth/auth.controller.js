const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./auth.model");
const {
    setUserSession,
    clearUserSession
} = require("../../middleware/sessionCookies");

const {
    encryptUserData,
    decryptUserData
} = require("../../crypto/rsa/user.rsa");

const {
    getRSAPublicKey,
    getRSAPrivateKey
} = require("../../crypto/rsa/rsa.keyProvider");

const DEV_RSA_KEY_ID = "dev-rsa-key";

const decryptUserForResponse = async (user) => {
    // Existing users may still contain plaintext names.
    if (typeof user.name === "string") {
        return {
            name: user.name
        };
    }

    const privateKey =
        await getRSAPrivateKey(
            DEV_RSA_KEY_ID
        );

    const decrypted =
        await decryptUserData(
            {
                name: user.name
            },
            privateKey
        );

    return {
        name: decrypted.name
    };
};


// Register User
const registerUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password
        } = req.body;

        // Check existing user
        const existingUser =
            await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message:
                    "User already exists"
            });
        }

        // Hash password using bcrypt.
        // Password is NEVER RSA encrypted.
        const salt =
            await bcrypt.genSalt(10);

        const hashedPassword =
            await bcrypt.hash(
                password,
                salt
            );

        // Obtain RSA public key through
        // the configured key provider.
        const publicKey =
            await getRSAPublicKey(
                DEV_RSA_KEY_ID
            );

        // Encrypt protected user data.
        const encryptedUser =
            await encryptUserData(
                {
                    name,
                    email,
                    password:
                        hashedPassword
                },
                publicKey
            );

        // Create user.
        //
        // email remains plaintext temporarily because
        // the current login flow performs:
        // User.findOne({ email })
        //
        // This will be replaced with secure lookup
        // after key-management/HMAC integration.
        const user =
            await User.create({
                name:
                    encryptedUser.name,

                email,

                password:
                    encryptedUser.password
            });

            return res.status(201).json({
                message:
                    "User registered successfully",

                user: {
                    id: user._id,
                    name,
                    email: user.email
                }
            });

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// Login User
const loginUser = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        // Find user.
        //
        // Email remains plaintext temporarily
        // for compatibility with the existing
        // authentication flow.
        const user =
            await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message:
                    "Invalid email or password"
            });
        }

        // Compare password hash.
        const isMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isMatch) {
            return res.status(400).json({
                message:
                    "Invalid email or password"
            });
        }

        // Create JWT token.
        const token =
            jwt.sign(
                {
                    id: user._id
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "7d"
                }
            );

            setUserSession(res, token);

const decryptedUser =
    await decryptUserForResponse(
        user
    );

return res.status(200).json({
    message:
        "Login successful",

    user: {
        id: user._id,
        name: decryptedUser.name,
        email: user.email
    }
});

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const logoutUser = (req, res) => {
    clearUserSession(res);
    return res.status(200).json({ message: "Logout successful" });
};

const getProfile = async (req, res) => {
    try {
        const user =
            await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        let decryptedName = user.name;

        // New users store the name as a
        // Custom RSA encrypted envelope.
        if (
            user.name &&
            typeof user.name === "object" &&
            !Array.isArray(user.name)
        ) {
            const privateKey =
                await getRSAPrivateKey(
                    DEV_RSA_KEY_ID
                );

            const decrypted =
                await decryptUserData(
                    {
                        name: user.name
                    },
                    privateKey
                );

            decryptedName =
                decrypted.name;
        }

        return res.status(200).json({
            message:
                "Profile accessed successfully",

            user: {
                id: user._id,
                name: decryptedName,
                email: user.email
            }
        });

    } catch (error) {
        return res.status(500).json({
            message:
                "Failed to load profile",
            error: error.message
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getProfile
};
