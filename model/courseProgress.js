const { Sequelize } = require('sequelize');
const db = require('../config/db.js');
const { DataTypes } = Sequelize;
const User = require('./user.js');
const Course = require('./course.js');
const Lession = require('./lessions.js');

const CourseProgress = db.define('CourseProgress', {
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
    course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Course,
            key: 'id'
        }
    },
    lession_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Lession,
            key: 'id'
        }
    },
    status: {
        type: DataTypes.ENUM('not_started', 'in_progress', 'completed'),
        allowNull: false,
        defaultValue: 'not_started'
    },
    progress_percentage: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0,
            max: 100
        }
    },
    last_accessed_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
}, {
    tableName: 'course_progress',
    timestamps: true,
});

// Define Associations
User.hasMany(CourseProgress, { foreignKey: 'user_id', onDelete: 'CASCADE' });
CourseProgress.belongsTo(User, { foreignKey: 'user_id' });

Course.hasMany(CourseProgress, { foreignKey: 'course_id', onDelete: 'CASCADE' });
CourseProgress.belongsTo(Course, { foreignKey: 'course_id' });

Lession.hasMany(CourseProgress, { foreignKey: 'lession_id', onDelete: 'CASCADE' });
CourseProgress.belongsTo(Lession, { foreignKey: 'lession_id' });

module.exports = CourseProgress;
