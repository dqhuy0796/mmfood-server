import bcrypt from "bcryptjs";
import db from "../models";
import { ResponseCode } from "../constant";

/** GET USER(S) */

let handleGetUser = (username) => {
    return new Promise(async (resolve, reject) => {
        try {
            // undefined id
            if (!username) {
                const code = ResponseCode.MISSING_PARAMETER;
                const message = "Missing parameter(s).";
                const result = {};
                resolve({ code, message, result });
            }

            // id === all
            if (username === "all") {
                let users = await db.User.findAll({
                    attributes: {
                        exclude: ["password"],
                    },
                    order: [["id", "DESC"]],
                });

                const code = ResponseCode.SUCCESS;
                const message = "Get user(s) successfully.";
                const result = users;
                resolve({ code, message, result });
            }

            // valid id
            let user = await db.User.findOne({
                attributes: {
                    exclude: ["password"],
                },
                where: { username: username },
            });

            // if user not found
            if (!user) {
                const code = ResponseCode.FILE_NOT_FOUND;
                const message = "User not found.";
                const result = {};
                resolve({ code, message, result });
            }

            // if user found
            const code = ResponseCode.SUCCESS;
            const message = "Get user(s) successfully.";
            const result = user;
            resolve({ code, message, result });
        } catch (error) {
            reject(error);
        }
    });
};

/** CREATE NEW USER */

let handleCreateUser = (user) => {
    return new Promise(async (resolve, reject) => {
        try {
            let isExist = await isExistUsername(user.username);
            // if username already in use
            if (isExist) {
                const code = ResponseCode.DATABASE_ERROR;
                const message = "username already in use.";
                const result = {};
                resolve({ code, message, result });
            } else {
                let hashedPassword = hashPassword(user.password);
                await db.User.create({
                    username: user.username,
                    password: hashedPassword,
                    name: user.name,
                    birth: user.birth || null,
                    avatarUrl: user.avatarUrl || null,
                    phoneNumber: user.phoneNumber,
                    email: user.email,
                    address: user.address,
                    role: user.role,
                });

                const code = ResponseCode.SUCCESS;
                const message = "Create user successfully.";
                const result = user;
                resolve({ code, message, result });
            }
        } catch (error) {
            reject(error);
        }
    });
};

/** UPDATE USER */

let handleUpdateUser = (user) => {
    return new Promise(async (resolve, reject) => {
        try {
            let targetUser = await db.User.findOne({
                where: { username: user.username },
            });

            if (targetUser) {
                await db.User.update(
                    {
                        name: user.name,
                        birth: user.birth || null,
                        avatarUrl: user.avatarUrl || null,
                        phoneNumber: user.phoneNumber,
                        email: user.email,
                        address: user.address,
                        role: user.role,
                    },
                    {
                        where: { username: user.username },
                    },
                );
                const code = ResponseCode.SUCCESS;
                const message = "Update user infomation successfully";
                const result = user;
                resolve({ code, message, result });
            } else {
                const code = ResponseCode.DATABASE_ERROR;
                const message = "Invalid user infomation";
                const result = {};
                resolve({ code, message, result });
            }
        } catch (error) {
            reject(error);
        }
    });
};

/** DELETE USER */

let handleDeleteUser = (username) => {
    return new Promise(async (resolve, reject) => {
        try {
            let targetUser = await db.User.findOne({
                where: { username: username },
            });

            if (targetUser) {
                await db.User.destroy({
                    where: { username: username },
                });
                const code = ResponseCode.SUCCESS;
                const message = "Delete user infomation successfully";
                resolve({ code, message, username });
            } else {
                const code = ResponseCode.DATABASE_ERROR;
                const message = "Invalid user infomation";
                resolve({ code, message, username });
            }
        } catch (error) {
            reject(error);
        }
    });
};

/** SUPPORTER METHODS */
let isExistUsername = async (username) => {
    try {
        let user = await db.User.findOne({
            where: {
                username: username,
            },
        });
        if (user) {
            return true;
        }
        return false;
    } catch (error) {
        throw error;
    }
};

let isNumeric = (input) => {
    return !isNaN(input);
};

let hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
};

module.exports = {
    handleGetUser,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
};
