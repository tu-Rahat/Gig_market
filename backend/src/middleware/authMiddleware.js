const jwt = require("jsonwebtoken");
const { getCookie, USER_COOKIE } = require("./sessionCookies");


const protect = async (req, res, next) => {

    try {

        // Get token from header
        const authHeader = req.headers.authorization;
        const token = getCookie(req, USER_COOKIE) ||
            (authHeader && authHeader.startsWith("Bearer ")
                ? authHeader.split(" ")[1]
                : null);


        if (!token) {

            return res.status(401).json({
                message: "Not authorized, no token"
            });

        }


        // Extract token
        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        // Attach user information
        req.user = decoded;


        next();


    } catch (error) {

        return res.status(401).json({
            message: "Not authorized, invalid token"
        });

    }

};


module.exports = protect;