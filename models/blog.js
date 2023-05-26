const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const Category = require('./category');
const Tag = require('./tag');

const Blog = sequelize.define(
    'Blog',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        urlSlug: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        metaTitle: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        metaDescription: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        metaKeywords: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        bannerImg: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        draft: {
            type: DataTypes.INTEGER,
        },
        views: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    },
    {
        tableName: 'blog',
    }
);

Blog.belongsTo(Category, { foreignKey: 'categoryId', as: 'Category' });
Category.hasMany(Blog, { foreignKey: 'categoryId', as: 'Blogs' });

Blog.belongsToMany(Tag, { through: 'BlogTag', as: 'Tags' });
Tag.belongsToMany(Blog, { through: 'BlogTag', as: 'Blogs' });

module.exports = Blog;