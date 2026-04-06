"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("payments_received", "bank_account_id", {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: "bank_accounts",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("payments_received", "bank_account_id");
  },
};
