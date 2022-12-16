import bcrypt from "bcryptjs";
import db from "../models";

let handleLogin = (phone, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};
            let isExist = await isExistPhone(phone);
            if (isExist) {
                let currentUser = await db.User.findOne({
                    attributes: ["phone", "email", "name", "password", "role"],
                    where: { phone: phone },
                    raw: true,
                });
                if (currentUser) {
                    let isValidPassword = bcrypt.compareSync(password, currentUser.password);
                    if (isValidPassword) {
                        data.code = 0;
                        data.message = "authenticate successfully";
                        delete currentUser.password;
                        data.result = currentUser;
                    } else {
                        data.code = 1;
                        data.message = "incorrect password";
                    }
                } else {
                    data.code = 2;
                    data.message = "invalid phone";
                }
            } else {
                data.code = 2;
                data.message = "invalid phone";
            }
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
};

let handleRegister = (user) => {
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
                    role: "customer",
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

let isExistEmail = (currentEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let currentUser = await db.User.findOne({
                where: {
                    email: currentEmail,
                },
            });
            if (currentUser) {
                console.log(currentUser);
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (error) {
            reject(error);
        }
    });
};

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
                });

                data.code = 0;
                data.message = "get user(s) success";
                data.result = users;
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

let isValidUser = (user) => {
    if (isExistEmail(user.email) || isExistPhone(user.phone)) {
        return false;
    }
    return true;
};

let handleCreateUser = (user) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};
            let isExist = await isExistPhone(phone);
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
    handleLogin,
    handleRegister,
    handleGetUser,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
};
