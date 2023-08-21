const ResponseCode = require("../constant").ResponseCode;
const userAuthService = require("../services/userAuthService");
const customerAuthService = require("../services/customerAuthService");

/** -------------------------------- USER AUTH -------------------------------- */

let userLogin = async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    if (!username || !password) {
        return res.status(500).json({
            code: ResponseCode.AUTHENTICATION_ERROR,
            message: "Incorrect username or password.",
        });
    }

    let data = await userAuthService.handleLogin(username, password);

    return res.status(200).json(data);
};

let userRefresh = async (req, res) => {
    const token = req.body["x-refresh-token"];

    if (!token) {
        return res.status(403).json({
            code: ResponseCode.AUTHORIZATION_ERROR,
            message: "Forbidden. Invalid refresh token.",
        });
    }

    let data = await userAuthService.handleRegenerateAccessToken(token);

    return res.status(200).json(data);
};

let changeUserPassword = async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let newPassword = req.body.newPassword;

    if (!username || !password || !newPassword) {
        return res.status(500).json({
            code: ResponseCode.AUTHENTICATION_ERROR,
            message: "Missing infomation.",
        });
    }

    let data = await userAuthService.handleChangePassword(username, password, newPassword);

    return res.status(200).json(data);
};

/** -------------------------------- CUSTOMER AUTH -------------------------------- */

let customerLogin = async (req, res) => {
    let phoneNumber = req.body.phoneNumber;
    let password = req.body.password;

    if (!phoneNumber || !password) {
        return res.status(500).json({
            code: ResponseCode.AUTHENTICATION_ERROR,
            message: "Incorrect phone number or password.",
        });
    }

    let data = await customerAuthService.handleLogin(phoneNumber, password);

    return res.status(200).json(data);
};

const customerRegister = async (req, res) => {
    const { password, name, phoneNumber, email } = req.body;

    if (!phoneNumber || !password || !name || !email) {
        return res.status(500).json({
            code: ResponseCode.AUTHENTICATION_ERROR,
            message: "Missing information.",
        });
    }

    const data = await customerAuthService.handleRegister({
        password,
        name,
        phoneNumber,
        email,
    });

    return res.status(200).json(data);
};

const customerUpdateProfile = async (req, res) => {
    const { email, phoneNumber, name, birth } = req.body;

    if (!phoneNumber || !email || !name || !birth) {
        return res.status(500).json({
            code: ResponseCode.AUTHENTICATION_ERROR,
            message: "Missing information.",
        });
    }

    const data = await customerAuthService.handleUpdateProfile({
        email,
        phoneNumber,
        name,
        birth,
    });

    return res.status(200).json(data);
};

let customerVerifyRefreshToken = async (req, res) => {
    const token = req.body["x-refresh-token"];

    if (!token) {
        return res.status(403).json({
            code: ResponseCode.AUTHORIZATION_ERROR,
            message: "Forbidden. Invalid refresh token.",
        });
    }

    let data = await customerAuthService.handleVerifyRefreshToken(token);

    return res.status(200).json(data);
};

let customerRefreshTokens = async (req, res) => {
    const token = req.body["x-refresh-token"];

    if (!token) {
        return res.status(403).json({
            code: ResponseCode.AUTHORIZATION_ERROR,
            message: "Forbidden. Invalid refresh token.",
        });
    }

    let data = await customerAuthService.handleRefreshTokens(token);

    return res.status(200).json(data);
};

let changeCustomerPassword = async (req, res) => {
    let phoneNumber = req.body.phoneNumber;
    let password = req.body.password;
    let newPassword = req.body.newPassword;

    if (!phoneNumber || !password || !newPassword) {
        return res.status(500).json({
            code: ResponseCode.AUTHENTICATION_ERROR,
            message: "Missing infomation.",
        });
    }

    let data = await customerAuthService.handleChangePassword(phoneNumber, password, newPassword);

    return res.status(200).json(data);
};

export default {
    userRefresh,
    userLogin,
    changeUserPassword,
    customerLogin,
    customerRegister,
    customerUpdateProfile,
    customerRefreshTokens,
    customerVerifyRefreshToken,
    changeCustomerPassword,
};
