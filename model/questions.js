const { Sequelize } = require('sequelize');
const db = require('../config/db.js');
const { DataTypes } = Sequelize;

const Questions = db.define('Questions', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  quiz_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  question: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  option_1: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  option_2: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  option_3: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  option_4: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  correct_answer: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'questions',
  timestamps: true,
});


module.exports = Questions;
