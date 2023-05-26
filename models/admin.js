const { DataTypes } = require('sequelize');
const sequelize = require("../utils/database");

const Admin = sequelize.define('Admin', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    super_admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    tableName: 'admin'
});

// Hook to insert a demo row in the Admin table after the tables are created
Admin.afterSync(async () => {
    await Admin.findOrCreate({
        where: { username: process.env.DEFAULT_USERNAME },
        defaults: { password: process.env.DEFAULT_USERNAME, super_admin: true }
    });
});

module.exports = Admin;