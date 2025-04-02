const { Sequelize } = require('sequelize');
const db = require('../config/db.js');
const { DataTypes } = Sequelize;
const Quiz = require('./quiz.js');
const Lession = db.define('Lession', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    lession_title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content_type: {
        type: DataTypes.ENUM('Video', 'Quiz'),
        allowNull: false,
    },
    lession_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    lession_video: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    lession_image: {
        type: DataTypes.STRING, 
        allowNull: true,
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    quiz_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    document_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'lession',
    timestamps: true,
});

// A Lesson can have one Quiz (One-to-One)
Lession.hasOne(Quiz, { foreignKey: "lession_id", onDelete: "CASCADE" });
Quiz.belongsTo(Lession, { foreignKey: "lession_id" });

module.exports = Lession;
