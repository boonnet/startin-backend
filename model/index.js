const { Sequelize } = require("sequelize");
const sequelize = require("../config/db.js"); // Ensure the same instance is used

const Course = require("./course.js")(sequelize, Sequelize);
const Certifications = require("./certifications.js")(sequelize, Sequelize);
const Subscription = require("./subscription.js")(sequelize, Sequelize);
const Lession = require("./lessions.js")(sequelize, Sequelize);
const Templates = require("./templates.js")(sequelize, Sequelize);

// Define Associations

// Subscription & Course Relationship
Subscription.hasMany(Course, { foreignKey: "subscription_id", as: "courses", onDelete: "CASCADE" });
Course.belongsTo(Subscription, { foreignKey: "subscription_id", as: "subscription" });

// Course & Lesson Relationship
Course.hasMany(Lession, { foreignKey: "course_id", as: "lessons", onDelete: "CASCADE" });
Lession.belongsTo(Course, { foreignKey: "course_id", as: "course" });

// Course & Certification Relationship
Course.hasOne(Certifications, { foreignKey: "course_id", as: "certification", onDelete: "CASCADE" });
Certifications.belongsTo(Course, { foreignKey: "course_id", as: "course" });

// Subscription & Templates Relationship
Subscription.hasMany(Templates, { foreignKey: "subscription_id", as: "templates", onDelete: "CASCADE" });
Templates.belongsTo(Subscription, { foreignKey: "subscription_id", as: "subscription" });

Lession.hasOne(Quiz, { foreignKey: "lession_id", onDelete: "CASCADE" });
Quiz.belongsTo(Lession, { foreignKey: "lession_id" });

Quiz.hasMany(Questions, { foreignKey: "quiz_id", onDelete: "CASCADE" });
Questions.belongsTo(Quiz, { foreignKey: "quiz_id" });
// Export all models
module.exports = { Course, Certifications, Subscription, Lession, Templates };
