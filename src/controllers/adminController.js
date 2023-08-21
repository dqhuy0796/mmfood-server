import adminService from "../services/adminService";

let adminLogin = async (req, res) => {
    let phoneNumber = req.body.phoneNumber;
    let password = req.body.password;

    if (!phoneNumber || !password) {
        return res.status(500).json({
            code: 4,
            message: "missing parameter(s)",
        });
    }

    let data = await adminService.handleAdminLogin(phoneNumber, password);

    return res.status(200).json({
        code: data.code,
        message: data.message,
        result: data.result ? data.result : {},
    });
};

export default {
    adminLogin,
};
