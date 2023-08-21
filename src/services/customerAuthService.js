import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ResponseCode } from "../constant";
import db from "../models";

/** CUSTOMER */

let handleLogin = (phoneNumber, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await db.Customer.findOne({
                where: { phoneNumber: phoneNumber },
                raw: true,
            });

            if (!result) {
                resolve({
                    code: ResponseCode.AUTHENTICATION_ERROR,
                    message: "Incorrect phone number or password",
                });
            }

            let isValidPassword = bcrypt.compareSync(password, result.password);
            if (!isValidPassword) {
                resolve({
                    code: ResponseCode.AUTHENTICATION_ERROR,
                    message: "Incorrect phone number or password",
                });
            }

            delete result.password;

            const defaultDeliveryAddress = await db.DeliveryAddress.findOne({
                where: {
                    customerId: result.id,
                    isDefault: true,
                },
            });
            result.defaultDeliveryAddress = defaultDeliveryAddress;

            const accessToken = await handleGenerateAccessToken(result.id, result.phoneNumber);
            const refreshToken = await handleGenerateRefreshToken(result.id, result.phoneNumber);

            const code = ResponseCode.SUCCESS;
            const message = "Authenticate successfully. Welcome!";
            resolve({ code, message, result, accessToken, refreshToken });
        } catch (error) {
            reject(error);
        }
    });
};

let handleRegister = (customer) => {
    return new Promise(async (resolve, reject) => {
        try {
            const isExistCustomer = await isExistPhone(customer.phoneNumber);

            if (isExistCustomer) {
                resolve({
                    code: ResponseCode.DATABASE_ERROR,
                    message: "Phone number already in use.",
                });
            } else {
                const hashedPassword = hashPassword(customer.password);

                await db.Customer.create({
                    password: hashedPassword,
                    name: customer.name,
                    birth: null,
                    avatarUrl: null,
                    phoneNumber: customer.phoneNumber,
                    email: customer.email,
                });

                resolve({
                    code: ResponseCode.SUCCESS,
                    message: "Register successfully. Welcome!",
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let handleChangePassword = (phoneNumber, password, newPassword) => {
    return new Promise(async (resolve, reject) => {
        try {
            let isExist = await isExistPhone(phoneNumber);

            if (!isExist) {
                resolve({
                    code: ResponseCode.AUTHENTICATION_ERROR,
                    message: "Incorrect phone number or password",
                });
            }

            let customer = await db.Customer.findOne({
                where: { phoneNumber: phoneNumber },
                raw: true,
            });

            if (!customer) {
                resolve({
                    code: ResponseCode.AUTHENTICATION_ERROR,
                    message: "Incorrect phone number or password",
                });
            }

            let isValidPassword = bcrypt.compareSync(password, customer.password);

            if (!isValidPassword) {
                resolve({
                    code: ResponseCode.AUTHENTICATION_ERROR,
                    message: "Incorrect phone number or password",
                });
            } else {
                let hashedPassword = hashPassword(newPassword);
                await db.Customer.update(
                    {
                        password: hashedPassword,
                    },
                    {
                        where: { phoneNumber: phoneNumber },
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

const handleUpdateProfile = async (customer) => {
    try {
        const existedCustomer = await db.Customer.findOne({
            where: {
                email: customer.email,
                phoneNumber: customer.phoneNumber,
            },
        });

        if (!existedCustomer) {
            return {
                code: ResponseCode.DATABASE_ERROR,
                message: "Invalid customer. Check again!",
            };
        }

        await db.Customer.update(
            {
                name: customer.name,
                birth: customer.birth,
            },
            {
                where: {
                    email: customer.email,
                    phoneNumber: customer.phoneNumber,
                },
            },
        );

        const updatedCustomer = await db.Customer.findOne({
            attributes: {
                exclude: ["password"],
            },
            where: {
                email: customer.email,
                phoneNumber: customer.phoneNumber,
            },
        });

        return {
            code: ResponseCode.SUCCESS,
            message: "Update customer successfully.",
            result: updatedCustomer,
        };
    } catch (error) {
        throw error;
    }
};

/** TOKEN */
const handleVerifyRefreshToken = async (refreshToken) => {
    try {
        return new Promise((resolve, reject) => {
            jwt.verify(refreshToken, process.env.NODE_REFRESH_TOKEN_SECRET_KEY, async (err, data) => {
                if (err) {
                    resolve({
                        code: ResponseCode.AUTHORIZATION_ERROR,
                        message: "Forbidden. Invalid refresh token.",
                    });
                }

                const existedRefreshToken = await db.RefreshToken.findOne({
                    where: {
                        username: data.phoneNumber,
                    },
                });

                if (!existedRefreshToken || refreshToken !== existedRefreshToken.token) {
                    resolve({
                        code: ResponseCode.AUTHORIZATION_ERROR,
                        message: "Forbidden. Invalid refresh token.",
                    });
                }

                resolve({
                    code: ResponseCode.SUCCESS,
                    message: "Valid refresh token.",
                });
            });
        });
    } catch (error) {
        console.error(error);
        return {
            code: ResponseCode.INTERNAL_SERVER_ERROR,
            message: "An error occurred.",
        };
    }
};

const handleRefreshTokens = async (refreshToken) => {
    try {
        return new Promise((resolve, reject) => {
            jwt.verify(refreshToken, process.env.NODE_REFRESH_TOKEN_SECRET_KEY, async (err, data) => {
                if (err) {
                    console.log(err, data);
                    resolve({
                        code: ResponseCode.AUTHORIZATION_ERROR,
                        message: "Forbidden. Invalid refresh token.",
                    });
                }

                const existedRefreshToken = await db.RefreshToken.findOne({
                    where: {
                        username: data.phoneNumber,
                    },
                });

                if (!existedRefreshToken || refreshToken !== existedRefreshToken.token) {
                    resolve({
                        code: ResponseCode.AUTHORIZATION_ERROR,
                        message: "Forbidden. Invalid refresh token.",
                        existedRefreshToken,
                    });
                }

                const newAccessToken = await handleGenerateAccessToken(data.id, data.phoneNumber);
                const newRefreshToken = await handleGenerateRefreshToken(data.id, data.phoneNumber);

                const code = ResponseCode.SUCCESS;
                const message = "Authenticate successfully. Welcome!";
                resolve({
                    code,
                    message,
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
                });
            });
        });
    } catch (error) {
        console.error(error);
        return {
            code: ResponseCode.INTERNAL_SERVER_ERROR,
            message: "An error occurred.",
        };
    }
};

const handleGenerateRefreshToken = async (id, phoneNumber) => {
    try {
        const newRefreshToken = jwt.sign({ time: Date(), id, phoneNumber }, process.env.NODE_REFRESH_TOKEN_SECRET_KEY, {
            expiresIn: process.env.NODE_REFRESH_TOKEN_EXPIRES_IN,
        });

        const expirationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        const existedRefreshToken = await db.RefreshToken.findOne({
            where: {
                username: phoneNumber,
            },
        });

        if (!existedRefreshToken) {
            await db.RefreshToken.create({
                username: phoneNumber,
                token: newRefreshToken,
                expirationDate: expirationDate,
            });
        } else {
            await db.RefreshToken.update(
                {
                    token: newRefreshToken,
                    expirationDate: expirationDate,
                },
                {
                    where: {
                        username: phoneNumber,
                    },
                },
            );
        }

        return newRefreshToken;
    } catch (error) {
        console.error(error);
        throw new Error("An error occurred while generating a refresh token.");
    }
};

const handleGenerateAccessToken = async (id, phoneNumber) => {
    const accessToken = jwt.sign({ time: Date(), id, phoneNumber }, process.env.NODE_ACCESS_TOKEN_SECRET_KEY, {
        expiresIn: process.env.NODE_ACCESS_TOKEN_EXPIRES_IN,
    });

    return accessToken;
};

/** SUPPORTER METHODS */

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
};

module.exports = {
    handleLogin,
    handleRegister,
    handleChangePassword,
    handleUpdateProfile,
    handleVerifyRefreshToken,
    handleRefreshTokens,
};
