const { Sequelize } = require('sequelize');
const db = require('../config/db.js');
const { DataTypes } = Sequelize;

const Subscription = db.define('Subscription', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    subscription_title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    validity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tax: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  }, {
    tableName: 'subscription',
    timestamps: true,
    
    instanceMethods: {
      getExpiryDate(startDate = new Date()) {
        const expiryDate = new Date(startDate);
        expiryDate.setDate(expiryDate.getDate() + this.validity_days);
        return expiryDate;
      }
    }
  });

Subscription.calculateExpiryDate = function(startDate, validityDays) {
  const expiryDate = new Date(startDate);
  expiryDate.setDate(expiryDate.getDate() + validityDays);
  return expiryDate;
};

module.exports = Subscription;
