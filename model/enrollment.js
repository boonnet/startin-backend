const { Sequelize } = require('sequelize');
const db = require('../config/db.js');
const { DataTypes } = Sequelize;

// Import models
const User = require('./user.js');
const Course = require('./course.js');
// Import Templates as a reference only to avoid circular dependency
const Templates = require('./templates.js');

const Enrollment = db.define('Enrollment', {
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
        allowNull: true,
        references: {
            model: Course,
            key: 'id'
        }
    },
    template_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'templates', // Use string reference instead of model object
            key: 'id'
        }
    },
    enrollment_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    expiry_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('active', 'expired', 'cancelled'),
        allowNull: false,
    }
}, {
    tableName: 'enrollments',
    timestamps: true,
});

// Define associations after model initialization
// User to Enrollment (one-to-many)
User.hasMany(Enrollment, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Enrollment.belongsTo(User, { foreignKey: 'user_id' });

// Course to Enrollment (one-to-many)
Course.hasMany(Enrollment, { foreignKey: 'course_id', onDelete: 'CASCADE' });
Enrollment.belongsTo(Course, { foreignKey: 'course_id' });

module.exports = Enrollment;