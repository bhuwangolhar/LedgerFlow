const Invoice = require("../../models/invoice.model");
const Customer = require("../../models/customer.model");

async function getAllInvoices(req, res) {
  try {
    const { organization_id } = req.query;
    
    const invoices = await Invoice.findAll({
      where: { organization_id },
      include: [
        { model: Customer, attributes: ['id', 'name', 'email', 'phone'] }
      ]
    });

    res.json(invoices);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch invoices",
      error: error.message
    });
  }
}

async function createInvoice(req, res) {
  try {
    const { customer_id, invoice_date, due_date, subtotal, tax_amount, total_amount, notes, organization_id } = req.body;

    if (!customer_id || !organization_id) {
      return res.status(400).json({
        message: "Customer_id and organization_id are required"
      });
    }

    // Auto-generate invoice_number
    const lastInvoice = await Invoice.findOne({
      order: [['created_at', 'DESC']]
    });
    let nextNum = 1;
    if (lastInvoice && lastInvoice.invoice_number) {
      const match = lastInvoice.invoice_number.match(/INV-(\d+)/);
      if (match) nextNum = parseInt(match[1]) + 1;
    }
    const invoice_number = `INV-${String(nextNum).padStart(4, "0")}`;

    const invoice = await Invoice.create({
      organization_id,
      customer_id,
      invoice_number,
      invoice_date,
      due_date,
      subtotal: subtotal || 0,
      tax_amount: tax_amount || 0,
      total_amount: total_amount || 0,
      amount_paid: 0,
      notes
    });

    res.status(201).json(invoice);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create invoice",
      error: error.message
    });
  }
}

async function updateInvoice(req, res) {
  try {
    const { id } = req.params;
    const { invoice_date, due_date, status, subtotal, tax_amount, total_amount, amount_paid, notes } = req.body;

    const invoice = await Invoice.findByPk(id);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    await invoice.update({
      invoice_date: invoice_date || invoice.invoice_date,
      due_date: due_date || invoice.due_date,
      status: status || invoice.status,
      subtotal: subtotal !== undefined ? subtotal : invoice.subtotal,
      tax_amount: tax_amount !== undefined ? tax_amount : invoice.tax_amount,
      total_amount: total_amount !== undefined ? total_amount : invoice.total_amount,
      amount_paid: amount_paid !== undefined ? amount_paid : invoice.amount_paid,
      notes: notes || invoice.notes
    });

    res.json(invoice);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update invoice",
      error: error.message
    });
  }
}

async function deleteInvoice(req, res) {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findByPk(id);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    await invoice.destroy();
    res.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    res.status(400).json({
      message: "Failed to delete invoice",
      error: error.message
    });
  }
}

module.exports = {
  getAllInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice
};
