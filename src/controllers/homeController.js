import db from '../models/index';

let getHomepage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        // console.log(data);
        return res.render('home.ejs', { data: JSON.stringify(data) });
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    getHomepage,
};
