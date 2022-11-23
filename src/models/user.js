'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    User.init(
        {
            password: DataTypes.STRING,
            name: DataTypes.STRING,
            birth: DataTypes.DATEONLY,
            avatarUrl: DataTypes.TEXT,
            phone: DataTypes.STRING,
            email: DataTypes.STRING,
            address: DataTypes.TEXT,
            role: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'User',
        },
    );
    return User;
};
