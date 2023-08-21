const jwt = require("jsonwebtoken");
const { ResponseCode } = require("../constant");

const verifyRefreshToken = (req, res, next) => {
    console.log("verifyRefreshToken");
    const token = req.body["x-refresh-token"];

    if (!token) {
        res.status(401).json({
            code: ResponseCode.AUTHORIZATION_ERROR,
            message: "Access denied. No token provided.",
        });
    }

    jwt.verify(token, process.env.NODE_REFRESH_TOKEN_SECRET_KEY, (err, data) => {
        if (err) {
            res.status(403).json({
                code: ResponseCode.AUTHORIZATION_ERROR,
                message: "Forbidden. Invalid access token.",
            });
        }
        next();
    });
};
module.exports = verifyRefreshToken;
