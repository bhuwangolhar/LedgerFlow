const { sequelize } = require("../../db");
const { Transaction, LedgerEntry, Account } = require("../../models");

async function createTransaction(data) {
  const { organization_id, description, date, entries } = data;

  // Validate entries array
  if (!Array.isArray(entries) || entries.length < 2) {
    throw new Error("A transaction must have at least 2 ledger entries.");
  }

  // Calculate totals — use fixed-point arithmetic to avoid float drift
  const totalDebit = entries.reduce(
    (sum, e) => sum + parseFloat(e.debit || 0),
    0
  );
  const totalCredit = entries.reduce(
    (sum, e) => sum + parseFloat(e.credit || 0),
    0
  );

  if (Math.abs(totalDebit - totalCredit) > 0.001) {
    throw new Error(
      `Total debits (${totalDebit.toFixed(2)}) must equal total credits (${totalCredit.toFixed(2)}).`
    );
  }

  const result = await sequelize.transaction(async (t) => {
    const transaction = await Transaction.create(
      { organization_id, description, date },
      { transaction: t }
    );

    const ledgerRows = entries.map((e) => ({
      transaction_id: transaction.id,
      account_id: e.account_id,
      debit: parseFloat(e.debit || 0),
      credit: parseFloat(e.credit || 0),
    }));

    await LedgerEntry.bulkCreate(ledgerRows, { transaction: t });

    return transaction;
  });

  return result;
}

async function getTransactions(organization_id) {
  const where = organization_id ? { organization_id } : {};

  const transactions = await Transaction.findAll({
    where,
    include: [
      {
        model: LedgerEntry,
        as: "entries",
        include: [{ model: Account, as: "account" }],
      },
    ],
    order: [["created_at", "DESC"]],
  });

  return transactions;
}

module.exports = {
  createTransaction,
  getTransactions,
};
