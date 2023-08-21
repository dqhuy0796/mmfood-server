import bcrypt from "bcryptjs";
import { ResponseCode } from "../constant";
import db from "../models";

/** CHECK USERNAME (PHONE) EXIST OR NOT */

let isExistPhone = (currentPhone) => {
    return new Promise(async (resolve, reject) => {
        try {
            let currentCustomer = await db.Customer.findOne({
                where: {
                    phoneNumber: currentPhone,
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

/** BCRYPT PASSWORD */

let hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
};

/** GET CUSTOMER(S) SERVICE */

let handleGetCustomer = (customerId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};
            if (customerId && customerId === "all") {
                let customers = await db.Customer.findAll({
                    attributes: {
                        exclude: ["password"],
                    },
                    order: [["id", "DESC"]],
                });

                data.code = ResponseCode.SUCCESS;
                data.message = "Get customer(s) successfully.";
                data.result = customers;
            }
            if (customerId && customerId !== "all") {
                let customer = await db.Customer.findOne({
                    attributes: {
                        exclude: ["password"],
                    },
                    where: {
                        id: customerId,
                    },
                });
                if (customer) {
                    data.code = ResponseCode.SUCCESS;
                    data.message = "Get customer(s) successfully.";
                    data.result = customer;
                } else {
                    data.code = ResponseCode.DATABASE_ERROR;
                    data.message = "Phone number already in use. Try again!";
                }
            }
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
};

/** CREATE NEW CUSTOMER SERVICE */

let handleCreateCustomer = (customer) => {
    return new Promise(async (resolve, reject) => {
        try {
            let isExist = await isExistPhone(customer.phoneNumber);

            if (isExist) {
                const code = ResponseCode.DATABASE_ERROR;
                const message = "Phone number already in use.";
                resolve({ code, message });
            }

            let hashedPassword = hashPassword(customer.password);

            await db.Customer.create({
                password: hashedPassword,
                name: customer.name,
                birth: customer.birth,
                avatarUrl: customer.avatarUrl,
                phoneNumber: customer.phoneNumber,
                email: customer.email,
                address: customer.address,
            });

            const code = ResponseCode.SUCCESS;
            const message = "Create customer successfully.";
            resolve({ code, message });
        } catch (error) {
            reject(error);
        }
    });
};

/** UPDATE CUSTOMER INFO */

let handleUpdateCustomer = (customer) => {
    return new Promise(async (resolve, reject) => {
        let data = {};
        try {
            let targetCustomer = await db.Customer.findOne({
                where: {
                    id: customer.id,
                },
            });
            if (targetCustomer) {
                await db.Customer.update(
                    {
                        name: customer.name,
                        birth: customer.birth,
                        avatarUrl: customer.avatarUrl,
                        phoneNumber: customer.phoneNumber,
                        email: customer.email,
                        address: customer.address,
                    },
                    {
                        where: {
                            id: customer.id,
                        },
                    },
                );
                data.code = ResponseCode.SUCCESS;
                data.message = "Update customer successfully.";
            } else {
                data.code = ResponseCode.FILE_NOT_FOUND;
                data.message = "Invalid customer. Check again!";
            }
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
};

let handleUpdateCustomerAddress = (phoneNumber, address) => {
    return new Promise(async (resolve, reject) => {
        let data = {};
        try {
            let targetCustomer = await db.Customer.findOne({
                where: {
                    phoneNumber: phoneNumber,
                },
            });
            if (targetCustomer && targetCustomer.address !== address) {
                await db.Customer.update(
                    {
                        address: address,
                    },
                    {
                        where: {
                            phoneNumber: phoneNumber,
                        },
                    },
                );
                data.code = 0;
                data.message = "update customer address successfully";
            } else {
                data.code = 1;
                data.message = "invalid customer address";
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
            let targetCustomer = await db.Customer.findOne({
                where: {
                    id: customerId,
                },
            });
            if (targetCustomer && targetCustomer.role === "customer") {
                await db.Customer.destroy({
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

module.exports = {
    handleGetCustomer,
    handleCreateCustomer,
    handleUpdateCustomer,
    handleUpdateCustomerAddress,
    handleDeleteCustomer,
};
