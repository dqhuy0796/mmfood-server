import bcrypt from "bcryptjs";
import db from "../models";
import { ResponseCode } from "../constant";

let isExistPhone = (currentPhone) => {
    return new Promise(async (resolve, reject) => {
        try {
            let currentUser = await db.User.findOne({
                where: {
                    phoneNumber: currentPhone,
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

let handleAdminLogin = (phoneNumber, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};
            let isExist = await isExistPhone(phoneNumber);
            if (isExist) {
                let currentUser = await db.User.findOne({
                    where: {
                        phoneNumber: phoneNumber,
                    },
                    raw: true,
                });
                if (currentUser) {
                    if (currentUser.role === "admin") {
                        let isValidPassword = bcrypt.compareSync(password, currentUser.password);
                        if (isValidPassword) {
                            data.code = ResponseCode.SUCCESS;
                            data.message = "Authenticate successfully";
                            delete currentUser.password;
                            data.result = currentUser;
                        } else {
                            data.code = ResponseCode.AUTHENTICATION_ERROR;
                            data.message = "Incorrect phoneNumber number or password";
                        }
                    } else {
                        data.code = ResponseCode.AUTHORIZATION_ERROR;
                        data.message = "Access denied";
                    }
                } else {
                    data.code = ResponseCode.AUTHENTICATION_ERROR;
                    data.message = "Incorrect phoneNumber number or password";
                }
            } else {
                data.code = ResponseCode.AUTHENTICATION_ERROR;
                data.message = "Incorrect phoneNumber number or password";
            }
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    handleAdminLogin,
};
