"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add customer_no to customers table
    await queryInterface.addColumn("customers", "customer_no", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });

    // Add vendor_no to vendors table
    await queryInterface.addColumn("vendors", "vendor_no", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });

    // Generate customer numbers for existing records
    const [customers] = await queryInterface.sequelize.query(
      "SELECT id FROM customers ORDER BY created_at"
    );
    for (let i = 0; i < customers.length; i++) {
      const customerNo = `CUST-${String(i + 1).padStart(4, "0")}`;
      await queryInterface.sequelize.query(
        `UPDATE customers SET customer_no = '${customerNo}' WHERE id = '${customers[i].id}'`
      );
    }

    // Generate vendor numbers for existing records
    const [vendors] = await queryInterface.sequelize.query(
      "SELECT id FROM vendors ORDER BY created_at"
    );
    for (let i = 0; i < vendors.length; i++) {
      const vendorNo = `VEND-${String(i + 1).padStart(4, "0")}`;
      await queryInterface.sequelize.query(
        `UPDATE vendors SET vendor_no = '${vendorNo}' WHERE id = '${vendors[i].id}'`
      );
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("customers", "customer_no");
    await queryInterface.removeColumn("vendors", "vendor_no");
  },
};
