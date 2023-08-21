const jwt = require("jsonwebtoken");
const { ResponseCode } = require("../constant");

const verifyAccessToken = (req, res, next) => {
    const authorizationHeader = req.headers["authorization"];
    if (!authorizationHeader) {
        return res.status(401).json({
            code: ResponseCode.AUTHORIZATION_ERROR,
            message: "Access denied. No token provided.",
        });
    }

    const token = authorizationHeader.split(" ")[1]; // 'Beaer <Token>'
    if (!token) {
        return res.status(401).json({
            code: ResponseCode.AUTHORIZATION_ERROR,
            message: "Access denied. No token provided.",
        });
    }

    jwt.verify(token, process.env.NODE_ACCESS_TOKEN_SECRET_KEY, (err, data) => {
        if (err) {
            return res.status(403).json({
                code: ResponseCode.AUTHORIZATION_ERROR,
                message: "Forbidden. Invalid access token.",
            });
        }
        next();
    });
};
module.exports = verifyAccessToken;
