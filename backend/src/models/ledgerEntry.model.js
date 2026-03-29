const { DataTypes } = require("sequelize");
const { sequelize } = require("./../db");

const LedgerEntry = sequelize.define(
  "LedgerEntry",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    transaction_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    account_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    debit: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false,
      defaultValue: 0,
    },
    credit: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "ledger_entries",
    timestamps: true,
    underscored: true,
  }
);

module.exports = LedgerEntry;