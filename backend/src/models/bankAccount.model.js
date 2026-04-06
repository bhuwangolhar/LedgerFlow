const { DataTypes } = require("sequelize");
const { sequelize } = require("./../db");

const BankAccount = sequelize.define(
  "BankAccount",
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

    account_name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    account_number: {
      type: DataTypes.STRING,
      allowNull: false
    },

    ifsc_code: {
      type: DataTypes.STRING,
      allowNull: false
    },

    bank_name: {
      type: DataTypes.STRING,
      allowNull: true
    },

    branch_name: {
      type: DataTypes.STRING,
      allowNull: true
    },

    branch_address: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    city: {
      type: DataTypes.STRING,
      allowNull: true
    },

    state: {
      type: DataTypes.STRING,
      allowNull: true
    },

    balance: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },

    security_pin: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: "bank_accounts",
    timestamps: true,
    underscored: true
  }
);

module.exports = BankAccount;
