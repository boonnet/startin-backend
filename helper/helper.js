const Setting = require("../model/settings");

const getStorageType = async () => {
  const setting = await Setting.findOne({
    attributes: ["storage_type"],
    order: [["id", "DESC"]],
  });
  return setting ? setting.storage_type : "local"; // Default to local if not found
};

module.exports = { getStorageType };
