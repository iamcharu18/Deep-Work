const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Tag = sequelize.define(
    'Tag',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        tagName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: 'tag',
    }
);

Tag.afterSync(async () => {
    await Tag.findOrCreate({
        where: { tagName: 'Testing' },
    });

    await Tag.findOrCreate({
        where: { tagName: 'Testing 2' },
    });

    await Tag.findOrCreate({
        where: { tagName: 'Testing 3' },
    });
});

module.exports = Tag;