import authService from "../services/authService";

let login = async (req, res) => {
    let phone = req.body.phone;
    let password = req.body.password;

    if (!phone || !password) {
        return res.status(500).json({
            code: 3,
            message: "missing phone or password",
        });
    }

    let data = await authService.handleLogin(phone, password);

    return res.status(200).json({
        code: data.code,
        message: data.message,
        result: data.result ? data.result : {},
    });
};

let register = async (req, res) => {
    let user = {};
    user.password = req.body.password;
    user.name = req.body.name;
    user.phone = req.body.phone;
    user.email = req.body.email;
    user.address = req.body.address;

    let data = await authService.handleRegister(user);

    return res.status(200).json({
        code: data.code,
        message: data.message,
    });
};

export default {
    login,
    register,
};
