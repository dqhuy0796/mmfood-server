import { ResponseCode } from "../constant";
import userService from "../services/userService";

let getUser = async (req, res) => {
    if (!req.query.username) {
        return res.status(500).json({
            code: ResponseCode.MISSING_PARAMETER,
            message: "Missing parameter(s). Check again.",
        });
    }
    let data = await userService.handleGetUser(req.query.username);

    return res.status(200).json(data);
};

let createUser = async (req, res) => {
    let user = {};
    user.username = req.body.username;
    user.password = req.body.password;
    user.name = req.body.name;
    user.birth = req.body.birth;
    user.avatarUrl = req.body.avatarUrl;
    user.phoneNumber = req.body.phoneNumber;
    user.email = req.body.email;
    user.address = req.body.address;
    user.role = req.body.role;

    let data = await userService.handleCreateUser(user);

    return res.status(200).json(data);
};

let updateUser = async (req, res) => {
    let user = {};
    user.username = req.body.username;
    user.name = req.body.name;
    user.birth = req.body.birth;
    user.avatarUrl = req.body.avatarUrl;
    user.phoneNumber = req.body.phoneNumber;
    user.email = req.body.email;
    user.address = req.body.address;
    user.role = req.body.role;

    let data = await userService.handleUpdateUser(user);

    return res.status(200).json(data);
};

let deleteUser = async (req, res) => {
    if (!req.body.username) {
        return res.status(500).json({
            code: ResponseCode.MISSING_PARAMETER,
            message: "Missing parameter(s). Check again.",
        });
    }

    let data = await userService.handleDeleteUser(req.body.username);

    return res.status(200).json(data);
};

export default {
    getUser,
    createUser,
    updateUser,
    deleteUser,
};
