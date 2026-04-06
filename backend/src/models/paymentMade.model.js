const { DataTypes } = require("sequelize");
const { sequelize } = require("./../db");

const PaymentMade = sequelize.define(
  "PaymentMade",
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

    bill_id: {
      type: DataTypes.UUID,
      allowNull: false
    },

    vendor_id: {
      type: DataTypes.UUID,
      allowNull: false
    },

    payment_date: {
      type: DataTypes.DATE,
      allowNull: false
    },

    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },

    payment_method: {
      type: DataTypes.ENUM("cash", "check", "credit_card", "bank_transfer", "other"),
      allowNull: false
    },

    reference_number: {
      type: DataTypes.STRING,
      allowNull: true
    },

    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    bank_account_id: {
      type: DataTypes.UUID,
      allowNull: false
    }
  },
  {
    tableName: "payments_made",
    timestamps: true,
    underscored: true
  }
);

module.exports = PaymentMade;
