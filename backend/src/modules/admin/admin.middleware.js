const jwt = require("jsonwebtoken");


const requireAdmin = (
    req,
    res,
    next
) => {
    try {

        const authorization =
            req.headers.authorization;

        if (
            !authorization ||
            !authorization.startsWith(
                "Bearer "
            )
        ) {
            return res.status(401).json({
                message:
                    "Admin authentication required"
            });
        }


        const token =
            authorization.split(" ")[1];


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