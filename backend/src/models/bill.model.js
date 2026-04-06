const { DataTypes } = require("sequelize");
const { sequelize } = require("./../db");

const Bill = sequelize.define(
  "Bill",
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

    vendor_id: {
      type: DataTypes.UUID,
      allowNull: false
    },

    bill_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    bill_date: {
      type: DataTypes.DATE,
      allowNull: false
    },

    due_date: {
      type: DataTypes.DATE,
      allowNull: false
    },

    status: {
      type: DataTypes.ENUM("draft", "pending", "paid"),
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
    tableName: "bills",
    timestamps: true,
    underscored: true
  }
);

module.exports = Bill;
