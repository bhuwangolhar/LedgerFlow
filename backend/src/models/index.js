const Account = require("./account.model");
const LedgerEntry = require("./ledgerEntry.model");
const Organization = require("./organization.model");
const Transaction = require("./transaction.model");
const User = require("./user.model");
const Customer = require("./customer.model");
const Vendor = require("./vendor.model");
const Invoice = require("./invoice.model");
const Bill = require("./bill.model");
const PaymentReceived = require("./paymentReceived.model");
const PaymentMade = require("./paymentMade.model");
const BankAccount = require("./bankAccount.model");

Transaction.hasMany(LedgerEntry, { foreignKey: "transaction_id", as: "entries" });
LedgerEntry.belongsTo(Transaction, { foreignKey: "transaction_id", as: "transaction" });

LedgerEntry.belongsTo(Account, { foreignKey: "account_id", as: "account" });
Account.hasMany(LedgerEntry, { foreignKey: "account_id", as: "ledger_entries" });

// Finance module associations
Customer.belongsTo(Organization, { foreignKey: "organization_id" });
Organization.hasMany(Customer, { foreignKey: "organization_id" });

Vendor.belongsTo(Organization, { foreignKey: "organization_id" });
Organization.hasMany(Vendor, { foreignKey: "organization_id" });

Invoice.belongsTo(Organization, { foreignKey: "organization_id" });
Invoice.belongsTo(Customer, { foreignKey: "customer_id" });
Organization.hasMany(Invoice, { foreignKey: "organization_id" });
Customer.hasMany(Invoice, { foreignKey: "customer_id" });

Bill.belongsTo(Organization, { foreignKey: "organization_id" });
Bill.belongsTo(Vendor, { foreignKey: "vendor_id" });
Organization.hasMany(Bill, { foreignKey: "organization_id" });
Vendor.hasMany(Bill, { foreignKey: "vendor_id" });

PaymentReceived.belongsTo(Organization, { foreignKey: "organization_id" });
PaymentReceived.belongsTo(Invoice, { foreignKey: "invoice_id" });
PaymentReceived.belongsTo(Customer, { foreignKey: "customer_id" });
Organization.hasMany(PaymentReceived, { foreignKey: "organization_id" });
Invoice.hasMany(PaymentReceived, { foreignKey: "invoice_id" });
Customer.hasMany(PaymentReceived, { foreignKey: "customer_id" });

PaymentMade.belongsTo(Organization, { foreignKey: "organization_id" });
PaymentMade.belongsTo(Bill, { foreignKey: "bill_id" });
PaymentMade.belongsTo(Vendor, { foreignKey: "vendor_id" });
PaymentMade.belongsTo(BankAccount, { foreignKey: "bank_account_id" });
Organization.hasMany(PaymentMade, { foreignKey: "organization_id" });
Bill.hasMany(PaymentMade, { foreignKey: "bill_id" });
Vendor.hasMany(PaymentMade, { foreignKey: "vendor_id" });
BankAccount.hasMany(PaymentMade, { foreignKey: "bank_account_id" });

// Bank Account associations
BankAccount.belongsTo(Organization, { foreignKey: "organization_id" });
Organization.hasMany(BankAccount, { foreignKey: "organization_id" });

PaymentReceived.belongsTo(BankAccount, { foreignKey: "bank_account_id" });
BankAccount.hasMany(PaymentReceived, { foreignKey: "bank_account_id" });

module.exports = {
  Account,
  LedgerEntry,
  Organization,
  Transaction,
  User,
  Customer,
  Vendor,
  Invoice,
  Bill,
  PaymentReceived,
  PaymentMade,
  BankAccount,
};
