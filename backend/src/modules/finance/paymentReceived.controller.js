const PaymentReceived = require("../../models/paymentReceived.model");
const BankAccount = require("../../models/bankAccount.model");
const Invoice = require("../../models/invoice.model");
const { sequelize } = require("../../db");

async function getAllPaymentsReceived(req, res) {
  try {
    const { organization_id } = req.query;
    
    const payments = await PaymentReceived.findAll({
      where: { organization_id },
      include: [
        { model: BankAccount, attributes: ['id', 'account_name', 'bank_name'] },
        { model: Invoice, attributes: ['id', 'invoice_number', 'total_amount'] }
      ]
    });

    res.json(payments);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch payments received",
      error: error.message
    });
  }
}

async function createPaymentReceived(req, res) {
  const transaction = await sequelize.transaction();
  
  try {
    const { invoice_id, customer_id, payment_date, amount, payment_method, reference_number, notes, organization_id, bank_account_id } = req.body;

    if (!invoice_id || !customer_id || !amount || !organization_id || !bank_account_id) {
      return res.status(400).json({
        message: "Invoice ID, customer ID, amount, bank account ID and organization ID are required"
      });
    }

    // Create payment record
    const payment = await PaymentReceived.create({
      organization_id,
      invoice_id,
      customer_id,
      payment_date,
      amount,
      payment_method,
      reference_number,
      notes,
      bank_account_id
    }, { transaction });

    // Update bank account balance (increase for payment received)
    const bankAccount = await BankAccount.findByPk(bank_account_id, { transaction });
    if (!bankAccount) {
      await transaction.rollback();
      return res.status(404).json({ message: "Bank account not found" });
    }

    const newBalance = parseFloat(bankAccount.balance) + parseFloat(amount);
    await bankAccount.update({ balance: newBalance }, { transaction });

    // Update invoice amount_paid and status
    const invoice = await Invoice.findByPk(invoice_id, { transaction });
    if (invoice) {
      const newAmountPaid = parseFloat(invoice.amount_paid) + parseFloat(amount);
      let newStatus = 'draft';
      if (newAmountPaid >= parseFloat(invoice.total_amount)) {
        newStatus = 'received';
      } else if (newAmountPaid > 0) {
        newStatus = 'pending';
      }
      await invoice.update({ 
        amount_paid: newAmountPaid,
        status: newStatus
      }, { transaction });
    }

    await transaction.commit();
    res.status(201).json(payment);
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({
      message: "Failed to create payment received",
      error: error.message
    });
  }
}

async function updatePaymentReceived(req, res) {
  try {
    const { id } = req.params;
    const { payment_date, amount, payment_method, reference_number, notes } = req.body;

    const payment = await PaymentReceived.findByPk(id);
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
      message: "Failed to update payment received",
      error: error.message
    });
  }
}

async function deletePaymentReceived(req, res) {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;

    const payment = await PaymentReceived.findByPk(id, { transaction });
    if (!payment) {
      await transaction.rollback();
      return res.status(404).json({ message: "Payment not found" });
    }

    // Reverse the bank account balance
    const bankAccount = await BankAccount.findByPk(payment.bank_account_id, { transaction });
    if (bankAccount) {
      const newBalance = parseFloat(bankAccount.balance) - parseFloat(payment.amount);
      await bankAccount.update({ balance: newBalance }, { transaction });
    }

    // Reverse invoice amount_paid and update status
    const invoice = await Invoice.findByPk(payment.invoice_id, { transaction });
    if (invoice) {
      const newAmountPaid = Math.max(0, parseFloat(invoice.amount_paid) - parseFloat(payment.amount));
      let newStatus = 'draft';
      if (newAmountPaid >= parseFloat(invoice.total_amount)) {
        newStatus = 'received';
      } else if (newAmountPaid > 0) {
        newStatus = 'pending';
      }
      await invoice.update({ 
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
      message: "Failed to delete payment received",
      error: error.message
    });
  }
}

module.exports = {
  getAllPaymentsReceived,
  createPaymentReceived,
  updatePaymentReceived,
  deletePaymentReceived
};
