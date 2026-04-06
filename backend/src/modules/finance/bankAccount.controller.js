const BankAccount = require("../../models/bankAccount.model");
const bcrypt = require("bcryptjs");

async function getAllBankAccounts(req, res) {
  try {
    const { organization_id } = req.query;
    
    const bankAccounts = await BankAccount.findAll({
      where: { organization_id },
      attributes: { exclude: ['security_pin', 'balance'] }
    });

    res.json(bankAccounts);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch bank accounts",
      error: error.message
    });
  }
}

async function createBankAccount(req, res) {
  try {
    const { 
      account_name, 
      account_number, 
      ifsc_code, 
      bank_name, 
      branch_name, 
      branch_address, 
      city, 
      state, 
      balance,
      organization_id,
      security_pin
    } = req.body;

    if (!account_name || !account_number || !ifsc_code || !organization_id || !security_pin) {
      return res.status(400).json({
        message: "Account name, account number, IFSC code, organization_id and security PIN are required"
      });
    }

    if (!/^\d{5}$/.test(security_pin)) {
      return res.status(400).json({
        message: "Security PIN must be exactly 5 digits"
      });
    }

    const hashedPin = await bcrypt.hash(security_pin, 10);

    const bankAccount = await BankAccount.create({
      organization_id,
      account_name,
      account_number,
      ifsc_code,
      bank_name,
      branch_name,
      branch_address,
      city,
      state,
      balance: balance || 0,
      security_pin: hashedPin
    });

    const { security_pin: _, ...accountWithoutPin } = bankAccount.toJSON();
    res.status(201).json(accountWithoutPin);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create bank account",
      error: error.message
    });
  }
}

async function updateBankAccount(req, res) {
  try {
    const { id } = req.params;
    const { account_name, account_number, ifsc_code, bank_name, branch_name, branch_address, city, state, balance, is_active } = req.body;

    const bankAccount = await BankAccount.findByPk(id);
    if (!bankAccount) {
      return res.status(404).json({ message: "Bank account not found" });
    }

    await bankAccount.update({
      account_name: account_name || bankAccount.account_name,
      account_number: account_number || bankAccount.account_number,
      ifsc_code: ifsc_code || bankAccount.ifsc_code,
      bank_name: bank_name || bankAccount.bank_name,
      branch_name: branch_name || bankAccount.branch_name,
      branch_address: branch_address || bankAccount.branch_address,
      city: city || bankAccount.city,
      state: state || bankAccount.state,
      balance: balance !== undefined ? balance : bankAccount.balance,
      is_active: is_active !== undefined ? is_active : bankAccount.is_active
    });

    res.json(bankAccount);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update bank account",
      error: error.message
    });
  }
}

async function deleteBankAccount(req, res) {
  try {
    const { id } = req.params;

    const bankAccount = await BankAccount.findByPk(id);
    if (!bankAccount) {
      return res.status(404).json({ message: "Bank account not found" });
    }

    await bankAccount.destroy();
    res.json({ message: "Bank account deleted successfully" });
  } catch (error) {
    res.status(400).json({
      message: "Failed to delete bank account",
      error: error.message
    });
  }
}

async function getBankAccountById(req, res) {
  try {
    const { id } = req.params;
    
    const bankAccount = await BankAccount.findByPk(id, {
      attributes: { exclude: ['security_pin', 'balance'] }
    });
    if (!bankAccount) {
      return res.status(404).json({ message: "Bank account not found" });
    }

    res.json(bankAccount);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch bank account",
      error: error.message
    });
  }
}

async function verifyPinAndGetBalance(req, res) {
  try {
    const { id } = req.params;
    const { security_pin } = req.body;

    if (!security_pin) {
      return res.status(400).json({ message: "Security PIN is required" });
    }

    const bankAccount = await BankAccount.findByPk(id);
    if (!bankAccount) {
      return res.status(404).json({ message: "Bank account not found" });
    }

    const isPinValid = await bcrypt.compare(security_pin, bankAccount.security_pin);
    if (!isPinValid) {
      return res.status(403).json({ message: "Invalid security PIN" });
    }

    res.json({ balance: bankAccount.balance });
  } catch (error) {
    res.status(500).json({
      message: "Failed to verify PIN",
      error: error.message
    });
  }
}

module.exports = {
  getAllBankAccounts,
  createBankAccount,
  updateBankAccount,
  deleteBankAccount,
  getBankAccountById,
  verifyPinAndGetBalance
};
