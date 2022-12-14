import bcrypt from "bcryptjs";
import db from "../models";
import { Sequelize } from "sequelize";
let handleLogin = (phone, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};
            let isExist = await isExistPhone(phone);
            if (isExist) {
                let currentUser = await db.User.findOne({
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

let handleChangePassword = (phone, password, newPassword) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};
            let isExist = await isExistPhone(phone);
            if (isExist) {
                let currentUser = await db.User.findOne({
                    where: { phone: phone },
                    raw: true,
                });
                if (currentUser) {
                    let isValidPassword = bcrypt.compareSync(password, currentUser.password);
                    if (isValidPassword) {
                        let hashedPassword = hashPassword(newPassword);
                        await db.User.update(
                            {
                                password: hashedPassword,
                            },
                            {
                                where: { phone: phone },
                            },
                        );
                        data.code = 0;
                        data.message = "change password success";
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

let handleSearch = (input) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};
            if (input && input === " ") {
                data.code = 1;
                data.message = "cannot search with blank input";
            }
            if (input && input !== " ") {
                const Op = Sequelize.Op;
                let products = await db.Product.findAll({
                    where: {
                        name: { [Op.like]: `%${input}%` },
                    },
                    order: [["categoryId", "ASC"]],
                });
                if (products.length > 0) {
                    data.code = 0;
                    data.message = "search success";
                    data.result = products;
                } else {
                    data.code = 2;
                    data.message = "no results match";
                }
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

export default {
    handleLogin,
    handleRegister,
    handleChangePassword,
    handleSearch,
};
