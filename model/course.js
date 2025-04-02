const { Sequelize } = require('sequelize');
const db = require('../config/db.js');
const { DataTypes } = Sequelize;
const Lession = require('./lessions.js');
const Certifications = require('./certifications.js');

const Course = db.define('Course', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    course_title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    parent_category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sub_category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    course_description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    course_image: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    preview_video: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    time_spend: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    course_requirements: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    course_level: {
        type: DataTypes.ENUM('Beginner', 'Intermediate', 'Advanced'), 
        allowNull: false,
    },
    validity_days: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 365, // Default to 1 year
    },
    course_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0, 
    },
    certificate_template: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'course',
    timestamps: true,
});

Course.hasMany(Lession, { foreignKey: "course_id", onDelete: "CASCADE" });
Lession.belongsTo(Course, { foreignKey: "course_id" });

Course.hasOne(Certifications, { foreignKey: "course_id", onDelete: "CASCADE" });
Certifications.belongsTo(Course, { foreignKey: "course_id" });

// Associations
Course.associate = (models) => {
    Course.hasMany(models.Favorites, { foreignKey: 'course_id' });
};


module.exports = Course;