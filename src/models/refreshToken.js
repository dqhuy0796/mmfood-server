"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class RefreshToken extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    RefreshToken.init(
        {
            username: DataTypes.STRING,
            token: DataTypes.TEXT,
            expirationDate: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: "RefreshToken",
            tableName: "refresh_tokens",
        },
    );
    return RefreshToken;
};
