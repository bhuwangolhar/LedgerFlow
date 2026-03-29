"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ledger_entries", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      transaction_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "transactions", key: "id" },
        onDelete: "CASCADE",
      },
      account_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "accounts", key: "id" },
        onDelete: "CASCADE",
      },
      debit: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
      },
      credit: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("ledger_entries");
  },
};