import bcrypt from "bcryptjs";
import db from "../models";

let isExistPhone = (currentPhone) => {
    return new Promise(async (resolve, reject) => {
        try {
            let currentUser = await db.User.findOne({
                where: {
                    phone: currentPhone,
                },
            });
            if (currentUser) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (error) {
            reject(error);
        }
    });
};

let handleGetUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};
            if (userId && userId === "all") {
                let users = await db.User.findAll({
                    attributes: {
                        exclude: ["password"],
                    },
                    order: [["id", "DESC"]],
                });

                data.code = 0;
                data.message = "get user(s) success";
                data.result = users.filter((item) => item.role !== "customer");
            }
            if (userId && userId !== "all") {
                let user = await db.User.findOne({
                    attributes: {
                        exclude: ["password"],
                    },
                    where: { id: userId },
                });
                if (user) {
                    data.code = 0;
                    data.message = "get user(s) success";
                    data.result = user;
                }
            }
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
};

let hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
    // return new Promise(async (resolve, reject) => {
    //     try {
    //         let hashPassword = bcrypt.hashSync(password, salt);
    //         resolve(hashPassword);
    //     } catch (error) {
    //         reject(error);
    //     }
    // });
};

let handleCreateUser = (user) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};
            let isExist = await isExistPhone(user.phone);
            if (!isExist) {
                let hashedPassword = hashPassword(user.password);
                await db.User.create({
                    password: hashedPassword,
                    name: user.name,
                    birth: user.birth,
                    avatarUrl: user.avatarUrl,
                    phone: user.phone,
                    email: user.email,
                    address: user.address,
                    role: user.role,
                });
                data.code = 0;
                data.message = "successfully";
            } else {
                data.code = 1;
                data.message = "phone number has been used";
            }
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
};

let handleUpdateUser = (user) => {
    return new Promise(async (resolve, reject) => {
        let data = {};
        try {
            let targetUser = await db.User.findOne({
                where: { id: user.id },
            });
            if (targetUser) {
                await db.User.update(
                    {
                        name: user.name,
                        birth: user.birth,
                        avatarUrl: user.avatarUrl,
                        phone: user.phone,
                        email: user.email,
                        address: user.address,
                        role: user.role,
                    },
                    {
                        where: { id: user.id },
                    },
                );
                data.code = 0;
                data.message = "update user successfully";
            } else {
                data.code = 1;
                data.message = "invalid user";
            }
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
};

let handleDeleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        let data = {};
        try {
            let targetUser = await db.User.findOne({
                where: { id: userId },
            });
            if (targetUser) {
                await db.User.destroy({
                    where: { id: userId },
                });
                data.code = 0;
                data.message = "delete user successfully";
            } else {
                data.code = 1;
                data.message = "invalid user";
            }
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
};

export default {
    handleGetUser,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
};
