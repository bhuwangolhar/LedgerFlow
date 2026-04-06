"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // For PostgreSQL, we need to update the ENUM types carefully
    // First, convert to VARCHAR to avoid enum conflicts
    await queryInterface.sequelize.query(`
      ALTER TABLE invoices ALTER COLUMN status DROP DEFAULT
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE invoices ALTER COLUMN status TYPE VARCHAR(255)
    `);
    
    // Update any existing statuses to the new valid values
    await queryInterface.sequelize.query(`
      UPDATE invoices SET status = 'draft' WHERE status NOT IN ('draft', 'pending', 'received')
    `);
    
    // Drop old enum and create new one
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_invoices_status" CASCADE
    `);
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_invoices_status" AS ENUM ('draft', 'pending', 'received')
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE invoices ALTER COLUMN status TYPE "enum_invoices_status" USING status::"enum_invoices_status"
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE invoices ALTER COLUMN status SET DEFAULT 'draft'
    `);

    // Same for bills
    await queryInterface.sequelize.query(`
      ALTER TABLE bills ALTER COLUMN status DROP DEFAULT
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE bills ALTER COLUMN status TYPE VARCHAR(255)
    `);
    
    await queryInterface.sequelize.query(`
      UPDATE bills SET status = 'draft' WHERE status NOT IN ('draft', 'pending', 'paid')
    `);
    
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_bills_status" CASCADE
    `);
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_bills_status" AS ENUM ('draft', 'pending', 'paid')
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE bills ALTER COLUMN status TYPE "enum_bills_status" USING status::"enum_bills_status"
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE bills ALTER COLUMN status SET DEFAULT 'draft'
    `);
  },

  async down(queryInterface, Sequelize) {
    // Revert invoices
    await queryInterface.sequelize.query(`
      ALTER TABLE invoices ALTER COLUMN status DROP DEFAULT
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE invoices ALTER COLUMN status TYPE VARCHAR(255)
    `);
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_invoices_status" CASCADE
    `);
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_invoices_status" AS ENUM ('draft', 'sent', 'paid', 'overdue', 'cancelled')
    `);
    await queryInterface.sequelize.query(`
      UPDATE invoices SET status = 'draft' WHERE status NOT IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE invoices ALTER COLUMN status TYPE "enum_invoices_status" USING status::"enum_invoices_status"
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE invoices ALTER COLUMN status SET DEFAULT 'draft'
    `);

    // Revert bills
    await queryInterface.sequelize.query(`
      ALTER TABLE bills ALTER COLUMN status DROP DEFAULT
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE bills ALTER COLUMN status TYPE VARCHAR(255)
    `);
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_bills_status" CASCADE
    `);
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_bills_status" AS ENUM ('draft', 'received', 'approved', 'paid', 'overdue', 'cancelled')
    `);
    await queryInterface.sequelize.query(`
      UPDATE bills SET status = 'draft' WHERE status NOT IN ('draft', 'received', 'approved', 'paid', 'overdue', 'cancelled')
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE bills ALTER COLUMN status TYPE "enum_bills_status" USING status::"enum_bills_status"
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE bills ALTER COLUMN status SET DEFAULT 'draft'
    `);
  },
};
