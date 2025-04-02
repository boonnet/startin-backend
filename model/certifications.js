const { Sequelize } = require('sequelize');
const db = require('../config/db.js');
const { DataTypes } = Sequelize;
const Course = require('./course.js');

const Certifications = db.define('Certifications', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'course',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  template: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'certifications',
  timestamps: true,
});


// Course.hasOne(Certifications, { foreignKey: 'course_id', onDelete: 'CASCADE' });
// Certifications.belongsTo(Course, { foreignKey: 'course_id' });

module.exports = Certifications;
