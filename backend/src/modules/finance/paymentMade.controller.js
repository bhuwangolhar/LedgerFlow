const PaymentMade = require("../../models/paymentMade.model");
const BankAccount = require("../../models/bankAccount.model");
const Bill = require("../../models/bill.model");
const { sequelize } = require("../../db");

async function getAllPaymentsMade(req, res) {
  try {
    const { organization_id } = req.query;
    
    const payments = await PaymentMade.findAll({
      where: { organization_id },
      include: [
        { model: BankAccount, attributes: ['id', 'account_name', 'bank_name'] },
        { model: Bill, attributes: ['id', 'bill_number', 'total_amount'] }
      ]
    });

    res.json(payments);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch payments made",
      error: error.message
    });
  }
}

async function createPaymentMade(req, res) {
  const transaction = await sequelize.transaction();
  
  try {
    const { bill_id, vendor_id, payment_date, amount, payment_method, reference_number, notes, organization_id, bank_account_id } = req.body;

    if (!bill_id || !vendor_id || !amount || !organization_id || !bank_account_id) {
      return res.status(400).json({
        message: "Bill ID, vendor ID, amount, bank account ID and organization ID are required"
      });
    }

    // Check if bank account has sufficient balance
    const bankAccount = await BankAccount.findByPk(bank_account_id, { transaction });
    if (!bankAccount) {
      await transaction.rollback();
      return res.status(404).json({ message: "Bank account not found" });
    }

    if (parseFloat(bankAccount.balance) < parseFloat(amount)) {
      await transaction.rollback();
      return res.status(400).json({ 
        message: "Insufficient balance in bank account",
        available_balance: bankAccount.balance
      });
    }

    // Create payment record
    const payment = await PaymentMade.create({
      organization_id,
      bill_id,
      vendor_id,
      payment_date,
      amount,
      payment_method,
      reference_number,
      notes,
      bank_account_id
    }, { transaction });

    // Update bank account balance (decrease for payment made)
    const newBalance = parseFloat(bankAccount.balance) - parseFloat(amount);
    await bankAccount.update({ balance: newBalance }, { transaction });

    // Update bill amount_paid and status
    const bill = await Bill.findByPk(bill_id, { transaction });
    if (bill) {
      const newAmountPaid = parseFloat(bill.amount_paid) + parseFloat(amount);
      let newStatus = 'draft';
      if (newAmountPaid >= parseFloat(bill.total_amount)) {
        newStatus = 'paid';
      } else if (newAmountPaid > 0) {
        newStatus = 'pending';
      }
      await bill.update({ 
        amount_paid: newAmountPaid,
        status: newStatus
      }, { transaction });
    }

    await transaction.commit();
    res.status(201).json(payment);
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({
      message: "Failed to create payment made",
      error: error.message
    });
  }
}

async function updatePaymentMade(req, res) {
  try {
    const { id } = req.params;
    const { payment_date, amount, payment_method, reference_number, notes } = req.body;

    const payment = await PaymentMade.findByPk(id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    await payment.update({
      payment_date: payment_date || payment.payment_date,
      amount: amount !== undefined ? amount : payment.amount,
      payment_method: payment_method || payment.payment_method,
      reference_number: reference_number || payment.reference_number,
      notes: notes || payment.notes
    });

    res.json(payment);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update payment made",
      error: error.message
    });
  }
}

async function deletePaymentMade(req, res) {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;

    const payment = await PaymentMade.findByPk(id, { transaction });
    if (!payment) {
      await transaction.rollback();
      return res.status(404).json({ message: "Payment not found" });
    }

    // Reverse the bank account balance
    const bankAccount = await BankAccount.findByPk(payment.bank_account_id, { transaction });
    if (bankAccount) {
      const newBalance = parseFloat(bankAccount.balance) + parseFloat(payment.amount);
      await bankAccount.update({ balance: newBalance }, { transaction });
    }

    // Reverse bill amount_paid and update status
    const bill = await Bill.findByPk(payment.bill_id, { transaction });
    if (bill) {
      const newAmountPaid = Math.max(0, parseFloat(bill.amount_paid) - parseFloat(payment.amount));
      let newStatus = 'draft';
      if (newAmountPaid >= parseFloat(bill.total_amount)) {
        newStatus = 'paid';
      } else if (newAmountPaid > 0) {
        newStatus = 'pending';
      }
      await bill.update({ 
        amount_paid: newAmountPaid,
        status: newStatus
      }, { transaction });
    }

    await payment.destroy({ transaction });
    await transaction.commit();
    
    res.json({ message: "Payment deleted successfully" });
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({
      message: "Failed to delete payment made",
      error: error.message
    });
  }
}

module.exports = {
  getAllPaymentsMade,
  createPaymentMade,
  updatePaymentMade,
  deletePaymentMade
};
