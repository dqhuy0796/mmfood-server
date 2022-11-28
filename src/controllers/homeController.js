import db from "../models/index";
// import bcrypt from "bcryptjs";
// const salt = bcrypt.genSaltSync(10);

// const hashPassword = (password) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             let hashPassword = await bcrypt.hashSync(password, salt);
//             resolve(hashPassword);
//         } catch (error) {
//             reject(error);
//         }
//     });
// };

let getHomepage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        return res.send({ data: JSON.stringify(data) });
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    getHomepage,
};
