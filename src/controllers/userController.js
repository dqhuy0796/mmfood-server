import userService from "../services/userService";

let handleAuthenticate = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        return res.status(500).json({
            code: "error",
            message: "missing email or password",
        });
    }

    let data = await userService.handleLogin(email, password);

    return res.status(200).json({
        code: data.code,
        message: data.message,
        user: data.user ? data.user : {},
    });
};

module.exports = {
    handleAuthenticate,
};
