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

let changePassword = async (req, res) => {
    let phone = req.body.phone;
    let password = req.body.password;
    let newPassword = req.body.newPassword;

    if (!phone || !password) {
        return res.status(500).json({
            code: 3,
            message: "missing parameter(s)",
        });
    }

    let data = await authService.handleChangePassword(phone, password, newPassword);

    return res.status(200).json({
        code: data.code,
        message: data.message,
    });
};

let search = async (req, res) => {
    if (req.query.input) {
        const input = req.query.input.trim();
        let data = await authService.handleSearch(input);
        return res.status(200).json({
            code: data.code,
            message: data.message,
            result: data.result ? data.result : [],
        });
    }
    return res.status(200).json({
        code: 1,
        message: "missing parameter(s)",
    });
};

export default {
    login,
    register,
    changePassword,
    search,
};
