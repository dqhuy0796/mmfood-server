import userService from "../services/userService";

let login = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        return res.status(500).json({
            code: 3,
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

let getUser = async (req, res) => {
    if (req.query.id) {
        let data = await userService.handleGetUser(req.query.id);
        return res.status(200).json({
            code: data.code,
            message: data.message,
            result: data.result ? data.result : {},
        });
    }
    return res.status(200).json({
        code: 1,
        message: "missing parameter(s)",
    });
};

let createUser = async (req, res) => {
    let user = {};
    user.password = req.body.password;
    user.name = req.body.name;
    user.birth = req.body.birth;
    user.avatarUrl = req.body.avatarUrl;
    user.phone = req.body.phone;
    user.email = req.body.email;
    user.address = req.body.address;
    user.role = req.body.role;

    let data = await userService.handleCreateUser(user);

    return res.status(200).json({
        code: data.code,
        message: data.message,
    });
};

let updateUser = async (req, res) => {
    let user = {};
    user.id = req.body.id;
    user.name = req.body.name;
    user.birth = req.body.birth;
    user.avatarUrl = req.body.avatarUrl;
    user.phone = req.body.phone;
    user.email = req.body.email;
    user.address = req.body.address;
    user.role = req.body.role;

    let data = await userService.handleUpdateUser(user);

    return res.status(200).json({
        code: data.code,
        message: data.message,
    });
};

let deleteUser = async (req, res) => {
    if (req.body.id) {
        let data = await userService.handleDeleteUser(req.body.id);
        console.log(data);
        return res.status(200).json({
            code: data.code,
            message: data.message,
        });
    }
    return res.status(200).json({
        code: 1,
        message: "missing parameter(s)",
    });
};

module.exports = {
    login,
    getUser,
    createUser,
    updateUser,
    deleteUser,
};
