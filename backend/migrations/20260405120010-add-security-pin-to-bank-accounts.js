"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if column exists first
    const tableDesc = await queryInterface.describeTable("bank_accounts");
    
    if (tableDesc.security_pin) {
      // Column exists, just update null values and make NOT NULL
      const defaultHashedPin = await bcrypt.hash("00000", 10);
      await queryInterface.sequelize.query(
        `UPDATE bank_accounts SET security_pin = '${defaultHashedPin}' WHERE security_pin IS NULL`
      );
      await queryInterface.changeColumn("bank_accounts", "security_pin", {
        type: Sequelize.STRING,
        allowNull: false,
      });
    } else {
      // Add column as nullable first
      await queryInterface.addColumn("bank_accounts", "security_pin", {
        type: Sequelize.STRING,
        allowNull: true,
      });

      // Set a default hashed PIN for existing accounts (default: 00000)
      const defaultHashedPin = await bcrypt.hash("00000", 10);
      await queryInterface.sequelize.query(
        `UPDATE bank_accounts SET security_pin = '${defaultHashedPin}' WHERE security_pin IS NULL`
      );

      // Now make it NOT NULL
      await queryInterface.changeColumn("bank_accounts", "security_pin", {
        type: Sequelize.STRING,
        allowNull: false,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("bank_accounts", "security_pin");
  },
};
