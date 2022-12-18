import bcrypt from "bcryptjs";
import db from "../models";

let isExistPhone = (currentPhone) => {
    return new Promise(async (resolve, reject) => {
        try {
            let currentCustomer = await db.User.findOne({
                where: {
                    phone: currentPhone,
                },
            });
            if (currentCustomer) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (error) {
            reject(error);
        }
    });
};

let handleGetCustomer = (customerId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};
            if (customerId && customerId === "all") {
                let customers = await db.User.findAll({
                    attributes: {
                        exclude: ["password"],
                    },
                    where: {
                        role: "customer",
                    },
                });

                data.code = 0;
                data.message = "get customer(s) success";
                data.result = customers;
            }
            if (customerId && customerId !== "all") {
                let customer = await db.User.findOne({
                    attributes: {
                        exclude: ["password"],
                    },
                    where: {
                        id: customerId,
                        role: "customer",
                    },
                });
                if (customer) {
                    data.code = 0;
                    data.message = "get customer(s) success";
                    data.result = customer;
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
};

let handleCreateCustomer = (customer) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};
            let isExist = await isExistPhone(customer.phone);
            if (!isExist) {
                let hashedPassword = hashPassword(customer.password);
                await db.User.create({
                    password: hashedPassword,
                    name: customer.name,
                    birth: customer.birth,
                    avatarUrl: customer.avatarUrl,
                    phone: customer.phone,
                    email: customer.email,
                    address: customer.address,
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

let handleUpdateCustomer = (customer) => {
    return new Promise(async (resolve, reject) => {
        let data = {};
        try {
            let targetCustomer = await db.User.findOne({
                where: {
                    id: customer.id,
                },
            });
            if (targetCustomer && targetCustomer.role === "customer") {
                await db.User.update(
                    {
                        name: customer.name,
                        birth: customer.birth,
                        avatarUrl: customer.avatarUrl,
                        phone: customer.phone,
                        email: customer.email,
                        address: customer.address,
                    },
                    {
                        where: {
                            id: customer.id,
                        },
                    },
                );
                data.code = 0;
                data.message = "update customer successfully";
            } else {
                data.code = 1;
                data.message = "invalid customer";
            }
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
};

let handleDeleteCustomer = (customerId) => {
    return new Promise(async (resolve, reject) => {
        let data = {};
        try {
            let targetCustomer = await db.User.findOne({
                where: {
                    id: customerId,
                },
            });
            if (targetCustomer && targetCustomer.role === "customer") {
                await db.User.destroy({
                    where: {
                        id: customerId,
                    },
                });
                data.code = 0;
                data.message = "delete customer successfully";
            } else {
                data.code = 1;
                data.message = "invalid customer";
            }
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
};

export default {
    handleGetCustomer,
    handleCreateCustomer,
    handleUpdateCustomer,
    handleDeleteCustomer,
};
