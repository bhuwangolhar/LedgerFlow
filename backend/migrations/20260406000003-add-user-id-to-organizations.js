"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if column already exists
    const table = await queryInterface.describeTable("organizations");
    if (table.user_id) {
      console.log("user_id column already exists, skipping...");
      return;
    }

    // Add user_id to organizations table
    await queryInterface.addColumn("organizations", "user_id", {
      type: Sequelize.UUID,
      allowNull: true, // temporarily nullable for existing data
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    // Set user_id for existing organizations based on their users
    await queryInterface.sequelize.query(`
      UPDATE organizations o
      SET user_id = (
        SELECT u.id FROM users u 
        WHERE u.organization_id = o.id 
        ORDER BY u.created_at ASC
        LIMIT 1
      )
      WHERE EXISTS (
        SELECT 1 FROM users u WHERE u.organization_id = o.id
      )
    `);

    // Delete organizations without any users (orphaned organizations)
    await queryInterface.sequelize.query(`
      DELETE FROM organizations 
      WHERE user_id IS NULL
    `);

    // Now make it NOT NULL
    await queryInterface.changeColumn("organizations", "user_id", {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("organizations", "user_id");
  },
};
