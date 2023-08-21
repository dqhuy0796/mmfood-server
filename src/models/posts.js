"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Posts extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Posts.init(
        {
            title: DataTypes.TEXT,
            overview: DataTypes.TEXT,
            content: DataTypes.TEXT,
            imageUrl: DataTypes.TEXT,
            author: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Posts",
            tableName: "posts",
        },
    );
    return Posts;
};
