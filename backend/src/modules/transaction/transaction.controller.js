const transactionService = require("./transaction.service");

async function createTransaction(req, res) {
  try {
    const transaction = await transactionService.createTransaction(req.body);
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({
      message: error.message || "Failed to create transaction",
    });
  }
}

async function getTransactions(req, res) {
  try {
    const { organization_id } = req.query;
    const transactions = await transactionService.getTransactions(organization_id);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch transactions",
      error: error.message,
    });
  }
}

module.exports = {
  createTransaction,
  getTransactions,
};