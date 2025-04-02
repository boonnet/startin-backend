const { Sequelize } = require('sequelize');
const db = require('../config/db.js');
const { DataTypes } = Sequelize;
const User = require('./user.js');
const Quiz = require('./quiz.js');

const QuizSubmission = db.define('QuizSubmission', {
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
  quiz_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Quiz,
      key: 'id'
    }
  },
  score: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
      max: 100
    }
  }
}, {
  tableName: 'quiz_submissions',
  timestamps: true,
});

// Define associations
QuizSubmission.belongsTo(User, { foreignKey: 'user_id' });
QuizSubmission.belongsTo(Quiz, { foreignKey: 'quiz_id' });

module.exports = QuizSubmission;
