const { Sequelize } = require('sequelize');
const db = require('../config/db.js');
const User = require('./user.js');
const { DataTypes } = Sequelize;

const Notification = db.define('Notification', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'uid'
        }
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }
}, {
    tableName: 'notifications',
    timestamps: true,
});

// Define the relationship with User model
Notification.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

module.exports = Notification;
