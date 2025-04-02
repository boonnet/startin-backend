const { Sequelize } = require("sequelize");
const db = require("../config/db.js");
const { DataTypes } = Sequelize;

const Setting = db.define(
  "Setting",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    storage_type: {
      type: DataTypes.ENUM("local", "s3"),
      allowNull: false,
      defaultValue: "local",
    },
    site_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    site_description: {
      type: DataTypes.STRING(500), // Allow up to 500 characters
      allowNull: true,
    },
    contact_mail: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true, // Ensures valid email format
      },
    },
    location_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    playstore_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    appstore_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    facebook_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    instagram_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    linkedin_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    about: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    contact_no: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isNumeric: true,
      },
    },
    fcm_key: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    site_icon: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    site_logo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    site_dark_logo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "settings",
    timestamps: true,
  }
);

module.exports = Setting;
