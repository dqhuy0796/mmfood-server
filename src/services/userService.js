import db from "../models";
import bcrypt from "bcryptjs";

let handleLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};
            let isExist = await isExistEmail(email);
            if (isExist) {
                let currentUser = await db.User.findOne({
                    attributes: ["email", "name", "password", "role"],
                    where: { email: email },
                    raw: true,
                });
                if (currentUser) {
                    let isValidPass = bcrypt.compareSync(password, currentUser.password);
                    if (isValidPass) {
                        data.code = "success";
                        data.message = "authenticate successfully";
                        delete currentUser.password;
                        data.user = currentUser;
                    } else {
                        data.code = "error";
                        data.message = "incorrect password";
                    }
                } else {
                    data.code = "error";
                    data.message = "invalid email";
                }
            } else {
                data.code = "error";
                data.message = "invalid email";
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
    handleLogin,
};
