const jwt = require("jsonwebtoken");

async function authUser(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized : No token provided"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (decoded.role !== "user" && decoded.role !== "artist") {
            return res.status(403).json({
                message: "You don't have access"
            })
        }

        req.user = decoded;
        next();
    }
    catch (error) {
        console.error("Detailed Error : ", error);
        return res.status(500).json({
            message: "Internal Server Error!",
            error: error.message
        })
    }
}

module.exports = { authUser };
