const Account = require("./account.model");
const LedgerEntry = require("./ledgerEntry.model");
const Organization = require("./organization.model");
const Transaction = require("./transaction.model");
const User = require("./user.model");

Transaction.hasMany(LedgerEntry, { foreignKey: "transaction_id", as: "entries" });
LedgerEntry.belongsTo(Transaction, { foreignKey: "transaction_id", as: "transaction" });

LedgerEntry.belongsTo(Account, { foreignKey: "account_id", as: "account" });
Account.hasMany(LedgerEntry, { foreignKey: "account_id", as: "ledger_entries" });

module.exports = {
  Account,
  LedgerEntry,
  Organization,
  Transaction,
  User,
};
