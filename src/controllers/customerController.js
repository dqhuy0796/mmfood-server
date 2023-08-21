import customerService from "../services/customerService";

let getCustomer = async (req, res) => {
    if (req.query.id) {
        let data = await customerService.handleGetCustomer(req.query.id);
        return res.status(200).json({
            code: data.code,
            message: data.message,
            result: data.result ? data.result : {},
        });
    }
    return res.status(200).json({
        code: 1,
        message: "missing parameter(s)",
    });
};

let createCustomer = async (req, res) => {
    let user = {};
    user.password = req.body.password;
    user.name = req.body.name;
    user.birth = req.body.birth;
    user.avatarUrl = req.body.avatarUrl;
    user.phoneNumber = req.body.phoneNumber;
    user.email = req.body.email;
    user.address = req.body.address;

    let data = await customerService.handleCreateCustomer(user);

    return res.status(200).json(data);
};

let updateCustomer = async (req, res) => {
    let user = {};
    user.id = req.body.id;
    user.name = req.body.name;
    user.birth = req.body.birth;
    user.avatarUrl = req.body.avatarUrl;
    user.phoneNumber = req.body.phoneNumber;
    user.email = req.body.email;
    user.address = req.body.address;

    let data = await customerService.handleUpdateCustomer(user);

    return res.status(200).json(data);
};

let updateCustomerAddress = async (req, res) => {
    if (!req.body.phoneNumber && req.body.address) {
        let data = await customerService.handleUpdateCustomerAddress(req.body.phoneNumber, req.body.address);

        return res.status(200).json(data);
    }
    return res.status(200).json({
        code: 1,
        message: "missing parameter(s)",
    });
};

let deleteCustomer = async (req, res) => {
    if (req.body.id) {
        let data = await customerService.handleDeleteCustomer(req.body.id);
        console.log(data);
        return res.status(200).json({
            code: data.code,
            message: data.message,
        });
    }
    return res.status(200).json({
        code: 1,
        message: "missing parameter(s)",
    });
};

export default {
    getCustomer,
    createCustomer,
    updateCustomer,
    updateCustomerAddress,
    deleteCustomer,
};
