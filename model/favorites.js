const { Sequelize } = require('sequelize');
const db = require('../config/db.js');
const { DataTypes } = Sequelize;
const User = require('./user.js');
const Course = require('./course.js');
const Templates = require('./templates.js');

const Favorites = db.define('Favorites', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    course_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    template_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
}, {
    tableName: 'favorites',
    timestamps: true,
});

// Important: Make sure models are imported before associations are created
// Set up associations
Favorites.belongsTo(User, { 
    foreignKey: 'user_id',
    targetKey: 'uid'  // Specify the target key explicitly
});
User.hasMany(Favorites, { 
    foreignKey: 'user_id',
    sourceKey: 'uid'  // Specify the source key explicitly
});

Favorites.belongsTo(Course, { 
    foreignKey: 'course_id',
    targetKey: 'id'
});
Course.hasMany(Favorites, { 
    foreignKey: 'course_id',
    sourceKey: 'id'
});

Favorites.belongsTo(Templates, { 
    foreignKey: 'template_id',
    targetKey: 'id'
});
Templates.hasMany(Favorites, { 
    foreignKey: 'template_id',
    sourceKey: 'id'
});

module.exports = Favorites;