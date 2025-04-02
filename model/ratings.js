const { Sequelize } = require('sequelize');
const db = require('../config/db.js');
const { DataTypes } = Sequelize;
const User = require('./user.js');
const Course = require('./course.js');

const Rating = db.define('Rating', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Course,
            key: 'id'
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'uid'
        }
    },
    review: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    }
}, {
    tableName: 'ratings',
    timestamps: true,
});

// Define Associations
User.hasMany(Rating, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Rating.belongsTo(User, { foreignKey: 'user_id' });

Course.hasMany(Rating, { foreignKey: 'course_id', onDelete: 'CASCADE' });
Rating.belongsTo(Course, { foreignKey: 'course_id' });

module.exports = Rating;
