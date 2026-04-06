const Bill = require("../../models/bill.model");
const Vendor = require("../../models/vendor.model");

async function getAllBills(req, res) {
  try {
    const { organization_id } = req.query;
    
    const bills = await Bill.findAll({
      where: { organization_id },
      include: [
        { model: Vendor, attributes: ['id', 'name', 'email', 'phone'] }
      ]
    });

    res.json(bills);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch bills",
      error: error.message
    });
  }
}

async function createBill(req, res) {
  try {
    const { vendor_id, bill_date, due_date, subtotal, tax_amount, total_amount, notes, organization_id } = req.body;

    if (!vendor_id || !organization_id) {
      return res.status(400).json({
        message: "Vendor_id and organization_id are required"
      });
    }

    // Auto-generate bill_number
    const lastBill = await Bill.findOne({
      order: [['created_at', 'DESC']]
    });
    let nextNum = 1;
    if (lastBill && lastBill.bill_number) {
      const match = lastBill.bill_number.match(/BILL-(\d+)/);
      if (match) nextNum = parseInt(match[1]) + 1;
    }
    const bill_number = `BILL-${String(nextNum).padStart(4, "0")}`;

    const bill = await Bill.create({
      organization_id,
      vendor_id,
      bill_number,
      bill_date,
      due_date,
      subtotal: subtotal || 0,
      tax_amount: tax_amount || 0,
      total_amount: total_amount || 0,
      amount_paid: 0,
      notes
    });

    res.status(201).json(bill);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create bill",
      error: error.message
    });
  }
}

async function updateBill(req, res) {
  try {
    const { id } = req.params;
    const { bill_date, due_date, status, subtotal, tax_amount, total_amount, amount_paid, notes } = req.body;

    const bill = await Bill.findByPk(id);
    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    await bill.update({
      bill_date: bill_date || bill.bill_date,
      due_date: due_date || bill.due_date,
      status: status || bill.status,
      subtotal: subtotal !== undefined ? subtotal : bill.subtotal,
      tax_amount: tax_amount !== undefined ? tax_amount : bill.tax_amount,
      total_amount: total_amount !== undefined ? total_amount : bill.total_amount,
      amount_paid: amount_paid !== undefined ? amount_paid : bill.amount_paid,
      notes: notes || bill.notes
    });

    res.json(bill);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update bill",
      error: error.message
    });
  }
}

async function deleteBill(req, res) {
  try {
    const { id } = req.params;

    const bill = await Bill.findByPk(id);
    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    await bill.destroy();
    res.json({ message: "Bill deleted successfully" });
  } catch (error) {
    res.status(400).json({
      message: "Failed to delete bill",
      error: error.message
    });
  }
}

module.exports = {
  getAllBills,
  createBill,
  updateBill,
  deleteBill
};
