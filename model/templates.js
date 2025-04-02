const { Sequelize } = require('sequelize');
const db = require('../config/db.js');
const { DataTypes } = Sequelize;

const Templates = db.define('Templates', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  template_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  cover_image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  files: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  }
}, {
  tableName: 'templates',
  timestamps: true,
});

// Set up the association between Templates and Enrollment
// We need to make sure this runs after the Enrollment model is defined
const setupAssociations = () => {
  const Enrollment = require('./enrollment.js');
  Templates.hasMany(Enrollment, { foreignKey: 'template_id', onDelete: 'CASCADE' });
  Enrollment.belongsTo(Templates, { foreignKey: 'template_id' });
  
};

Templates.associate = (models) => {
  Templates.hasMany(models.Favorites, { foreignKey: 'course_id' });
};

// We'll export the setupAssociations function so it can be called after all models are loaded
Templates.setupAssociations = setupAssociations;

module.exports = Templates;