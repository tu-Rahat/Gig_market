const jwt = require("jsonwebtoken");
const { getCookie, ADMIN_COOKIE } = require("../../middleware/sessionCookies");


const requireAdmin = (
    req,
    res,
    next
) => {
    try {

        const authorization =
            req.headers.authorization;
        const token = getCookie(req, ADMIN_COOKIE) ||
            (authorization && authorization.startsWith("Bearer ")
                ? authorization.split(" ")[1]
                : null);

        if (
            !token
        ) {
            return res.status(401).json({
                message:
                    "Admin authentication required"
            });
        }


        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        if (
            decoded.role !== "admin"
        ) {
            return res.status(403).json({
                message:
                    "Admin access only"
            });
        }


        req.admin = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            message:
                "Invalid or expired admin token"
        });

    }
};


module.exports = requireAdmin;