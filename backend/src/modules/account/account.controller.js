const accountService = require("./account.service");

async function createAccount(req, res) {
  try {
    const account = await accountService.createAccount(req.body);
    res.status(201).json(account);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create account",
      error: error.message,
    });
  }
}

async function getAccounts(req, res) {
  try {
    const { organization_id } = req.query;
    const accounts = await accountService.getAccounts(organization_id);
    res.json(accounts);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch accounts",
      error: error.message,
    });
  }
}

module.exports = {
  createAccount,
  getAccounts,
};