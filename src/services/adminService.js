import bcrypt from "bcryptjs";
import db from "../models";

let handleAdminLogin = (phone, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};
            let isExist = await isExistPhone(phone);
            if (isExist) {
                let currentUser = await db.User.findOne({
                    where: {
                        phone: phone,
                    },
                    raw: true,
                });
                if (currentUser) {
                    if (currentUser.role === "admin") {
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
                        data.message = "access denied";
                    }
                } else {
                    data.code = 3;
                    data.message = "invalid account";
                }
            } else {
                data.code = 3;
                data.message = "invalid account";
            }
            resolve(data);
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

export default {
    handleAdminLogin,
};
