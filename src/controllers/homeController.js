import db from "../models/index.js";

let getHomepage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        return res.status(200).json({
            result: data || [],
        });
    } catch (error) {
        console.log(error);
    }
};

export default {
    getHomepage,
};
