import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ResponseCode } from "../constant";
import db from "../models";

/** USER */

let handleLogin = (username, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { username: username },
                raw: true,
            });

            if (!user) {
                const code = ResponseCode.AUTHENTICATION_ERROR;
                const message = "Incorrect username or password";
                resolve({ code, message });
            }

            let isValidPassword = bcrypt.compareSync(password, user.password);

            if (!isValidPassword) {
                const code = ResponseCode.AUTHENTICATION_ERROR;
                const message = "Incorrect username or password";
                resolve({ code, message });
            }

            delete user.password;
            const result = user;
            const accessToken = jwt.sign(
                {
                    time: Date(),
                    username: user.username,
                    role: user.role,
                },
                process.env.NODE_ACCESS_TOKEN_SECRET_KEY,
                {
                    expiresIn: process.env.NODE_ACCESS_TOKEN_EXPIRES_IN,
                },
            );

            const refreshToken = await handleGenerateRefreshToken(user.username, user.role);

            const code = ResponseCode.SUCCESS;
            const message = "Authenticate successfully. Welcome!";
            resolve({ result, accessToken, refreshToken, code, message });
        } catch (error) {
            reject(error);
        }
    });
};

let handleChangePassword = (username, password, newPassword) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { username: username },
                raw: true,
            });

            if (!user) {
                resolve({
                    code: ResponseCode.AUTHENTICATION_ERROR,
                    message: "Incorrect username or password",
                });
            }

            let isValidPassword = bcrypt.compareSync(password, user.password);

            if (!isValidPassword) {
                resolve({
                    code: ResponseCode.AUTHENTICATION_ERROR,
                    message: "Incorrect username or password",
                });
            } else {
                let hashedPassword = hashPassword(newPassword);
                await db.User.update(
                    {
                        password: hashedPassword,
                    },
                    {
                        where: { username: username },
                    },
                );
                resolve({
                    code: ResponseCode.SUCCESS,
                    message: "Password has been changed.",
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let handleGenerateRefreshToken = async (username, role) => {
    try {
        const newRefreshToken = jwt.sign(
            { time: Date(), username: username, role: role },
            process.env.NODE_REFRESH_TOKEN_SECRET_KEY,
            { expiresIn: process.env.NODE_REFRESH_TOKEN_EXPIRES_IN },
        );
        const expirationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        let existedRefreshToken = await db.RefreshToken.findOne({
            where: {
                username: username,
            },
        });
        // create new if not exist
        if (!existedRefreshToken) {
            await db.RefreshToken.create({
                username: username,
                token: newRefreshToken,
                expirationDate: expirationDate,
            });
        }
        // update if exist
        else {
            await db.RefreshToken.update(
                {
                    token: newRefreshToken,
                    expirationDate: expirationDate,
                },
                {
                    where: {
                        username: username,
                    },
                },
            );
        }
        return newRefreshToken;
    } catch (error) {
        throw error;
    }
};

let handleRegenerateAccessToken = async (refreshToken) => {
    return new Promise((resolve, reject) => {
        try {
            jwt.verify(refreshToken, process.env.NODE_REFRESH_TOKEN_SECRET_KEY, async (err, data) => {
                console.log(err, data);
                if (err) {
                    resolve({
                        code: ResponseCode.AUTHORIZATION_ERROR,
                        message: "Forbidden. Invalid refresh token.",
                    });
                }

                let existedRefreshToken = await db.RefreshToken.findOne({
                    where: {
                        username: data.username,
                    },
                });

                if (refreshToken !== existedRefreshToken.token) {
                    resolve({
                        code: ResponseCode.AUTHORIZATION_ERROR,
                        message: "Forbidden. Invalid refresh token.",
                    });
                }

                const accessToken = jwt.sign(
                    { time: Date(), username: data.username, role: data.role },
                    process.env.NODE_ACCESS_TOKEN_SECRET_KEY,
                    { expiresIn: process.env.NODE_ACCESS_TOKEN_EXPIRES_IN },
                );

                resolve({
                    code: ResponseCode.SUCCESS,
                    message: "Generate access token successfully.",
                    accessToken: accessToken,
                });
            });
        } catch (error) {
            reject(error);
        }
    });
};

/** SUPPORTER METHODS */

let isExistUsername = (currentUsername) => {
    return new Promise(async (resolve, reject) => {
        try {
            let customer = await db.Customer.findOne({
                where: {
                    email: currentEmail,
                },
            });
            if (customer) {
                console.log(customer);
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
            let customer = await db.Customer.findOne({
                where: {
                    phoneNumber: currentPhone,
                },
            });
            if (customer) {
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

module.exports = {
    handleLogin,
    handleChangePassword,
    handleRegenerateAccessToken,
};
