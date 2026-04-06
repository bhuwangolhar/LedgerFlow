const { DataTypes } = require("sequelize");
const { sequelize } = require("./../db");

const Invoice = sequelize.define(
  "Invoice",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    organization_id: {
      type: DataTypes.UUID,
      allowNull: false
    },

    customer_id: {
      type: DataTypes.UUID,
      allowNull: false
    },

    invoice_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    invoice_date: {
      type: DataTypes.DATE,
      allowNull: false
    },

    due_date: {
      type: DataTypes.DATE,
      allowNull: false
    },

    status: {
      type: DataTypes.ENUM("draft", "pending", "received"),
      defaultValue: "draft"
    },

    subtotal: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0
    },

    tax_amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0
    },

    total_amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0
    },

    amount_paid: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0
    },

    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    tableName: "invoices",
    timestamps: true,
    underscored: true
  }
);

module.exports = Invoice;
