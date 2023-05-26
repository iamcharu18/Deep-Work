const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const Blog = require('./blog');

const Category = sequelize.define(
    'Category',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        categoryName: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
    },
    {
        tableName: 'category',
    }
);

Category.afterSync(async () => {
    await Category.findOrCreate({
        where: { categoryName: 'Testing' },
    });
});

module.exports = Category;