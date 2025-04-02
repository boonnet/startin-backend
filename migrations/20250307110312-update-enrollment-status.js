module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('enrollments', 'status', {
      type: Sequelize.ENUM('active', 'expired', 'cancelled'),
      allowNull: false,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('enrollments', 'status', {
      type: Sequelize.ENUM('active', 'expired', 'cancelled'),
      allowNull: false,
      defaultValue: 'active'
    });
  }
};
