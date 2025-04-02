const { Sequelize } = require('sequelize');
const db = require('../config/db.js');
const { DataTypes } = Sequelize;

const SubCategories = db.define('SubCategories', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  sub_category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'sub_category',
  timestamps: true,
});

module.exports = SubCategories;
