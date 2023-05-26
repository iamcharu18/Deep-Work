const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const ContactForm = sequelize.define('ContactForm', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mobile: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    time: {
        type: DataTypes.TIME,
        allowNull: false
    }
}, {
    tableName: 'contact_form',
    timestamps: false // Disable timestamps (createdAt, updatedAt)
});

module.exports = ContactForm;