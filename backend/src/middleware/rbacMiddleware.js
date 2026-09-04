"use strict";

/**
 * Role-Based Access Control (RBAC) Middleware
 * 
 * Restricts access based on user roles.
 * Server-side authorization check.
 */

/**
 * Require user to have one of the specified roles
 * 
 * @param {...string} allowedRoles - List of allowed roles
 * @returns {Function} - Express middleware
 */
const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (
            !req.user ||
            !allowedRoles.includes(req.user.role)
        ) {
            return res.status(403).json({
                message: "Forbidden: Insufficient privileges"
            });
        }

        next();
    };
};

/**
 * Require user to have ALL of the specified roles
 * (intersection of roles)
 * 
 * @param {...string} requiredRoles - List of required roles
 * @returns {Function} - Express middleware
 */
const requireAllRoles = (...requiredRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({
                message: "Forbidden: Not authenticated"
            });
        }

        const userRoles = Array.isArray(req.user.role)
            ? req.user.role
            : [req.user.role];

        const hasAllRoles = requiredRoles.every(
            role => userRoles.includes(role)
        );

        if (!hasAllRoles) {
            return res.status(403).json({
                message: "Forbidden: Missing required roles"
            });
        }

        next();
    };
};

/**
 * Restrict to authenticated users only
 * 
 * @returns {Function} - Express middleware
 */
const requireAuth = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            message: "Unauthorized: Authentication required"
        });
    }

    next();
};

/**
 * Check object-level ownership
 * 
 * Verifies the authenticated user owns/has access to a resource
 * 
 * @param {string} ownerFieldName - Name of owner field (default: 'owner' or 'userId')
 * @returns {Function} - Express middleware
 */
const checkOwnership = (ownerFieldName = 'owner') => {
    return (req, res, next) => {
        if (!req.user || !req.resource) {
            return res.status(403).json({
                message: "Forbidden: Resource not found or not accessible"
            });
        }

        const ownerId = req.resource[ownerFieldName];
        const userId = req.user.id || req.user._id;

        if (ownerId.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "Forbidden: You do not own this resource"
            });
        }

        next();
    };
};

/**
 * Middleware factory for checking object-level permissions
 * 
 * Custom authorization check based on a condition function
 * 
 * @param {Function} authorizationCheck - Function(req, res) returning boolean
 * @returns {Function} - Express middleware
 */
const requirePermission = (authorizationCheck) => {
    return async (req, res, next) => {
        try {
            const isAuthorized = await authorizationCheck(req, res);

            if (!isAuthorized) {
                return res.status(403).json({
                    message: "Forbidden: Insufficient permissions"
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                message: "Error checking permissions"
            });
        }
    };
};

module.exports = {
    requireRole,
    requireAllRoles,
    requireAuth,
    checkOwnership,
    requirePermission
};
