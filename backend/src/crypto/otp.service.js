"use strict";

const crypto = require("crypto");
const bcrypt = require("bcrypt");

/**
 * Generate a secure OTP (One-Time Password)
 * 
 * Uses cryptographically secure randomness.
 * Always 6 digits.
 * 
 * @returns {string} - 6-digit OTP
 */
const generateOtp = () => {
    return crypto
        .randomInt(100000, 1000000)
        .toString();
};

/**
 * Hash an OTP for storage
 * 
 * @param {string} otp - The OTP to hash
 * @returns {Promise<string>} - Bcrypt hash of the OTP
 */
const hashOtp = async (otp) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(otp, salt);
};

/**
 * Verify an OTP against a stored hash
 * 
 * @param {string} otp - The OTP to verify
 * @param {string} hash - The stored OTP hash
 * @returns {Promise<boolean>} - Whether the OTP matches
 */
const verifyOtp = async (otp, hash) => {
    return bcrypt.compare(otp, hash);
};

/**
 * Check if an OTP has expired
 * 
 * @param {Date|number} expiresAt - Expiration timestamp or Date object
 * @returns {boolean} - Whether the OTP is expired
 */
const isOtpExpired = (expiresAt) => {
    const expireTime = 
        expiresAt instanceof Date 
            ? expiresAt.getTime() 
            : expiresAt;
    return Date.now() > expireTime;
};

/**
 * Calculate OTP expiration time
 * 
 * @param {number} expirationMinutes - Minutes until expiration (default: 5)
 * @returns {number} - Timestamp of expiration
 */
const getOtpExpirationTime = (expirationMinutes = 5) => {
    return Date.now() + (expirationMinutes * 60 * 1000);
};

module.exports = {
    generateOtp,
    hashOtp,
    verifyOtp,
    isOtpExpired,
    getOtpExpirationTime
};
