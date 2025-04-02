const { Sequelize } = require('sequelize');
const db = require('../config/db.js');
const { DataTypes } = Sequelize;
const Questions = require('./questions.js');
const Quiz = db.define('Quiz', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  lession_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quiz_title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'quiz',
  timestamps: true,
});

// A Quiz has many Questions (One-to-Many)
Quiz.hasMany(Questions, { foreignKey: "quiz_id", onDelete: "CASCADE" });
Questions.belongsTo(Quiz, { foreignKey: "quiz_id" });

module.exports = Quiz;
