const Customer = require("../../models/customer.model");

async function getAllCustomers(req, res) {
  try {
    const { organization_id } = req.query;
    
    const customers = await Customer.findAll({
      where: { organization_id }
    });

    res.json(customers);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch customers",
      error: error.message
    });
  }
}

async function createCustomer(req, res) {
  try {
    const { name, email, phone, address, city, state, postal_code, country, tax_id, payment_terms, organization_id } = req.body;

    if (!name || !organization_id) {
      return res.status(400).json({
        message: "Name and organization_id are required"
      });
    }

    // Generate customer_no
    const lastCustomer = await Customer.findOne({
      order: [['created_at', 'DESC']]
    });
    let nextNum = 1;
    if (lastCustomer && lastCustomer.customer_no) {
      const match = lastCustomer.customer_no.match(/CUST-(\d+)/);
      if (match) nextNum = parseInt(match[1]) + 1;
    }
    const customer_no = `CUST-${String(nextNum).padStart(4, "0")}`;

    const customer = await Customer.create({
      organization_id,
      customer_no,
      name,
      email,
      phone,
      address,
      city,
      state,
      postal_code,
      country,
      tax_id,
      payment_terms
    });

    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create customer",
      error: error.message
    });
  }
}

async function updateCustomer(req, res) {
  try {
    const { id } = req.params;
    const { name, email, phone, address, city, state, postal_code, country, tax_id, payment_terms } = req.body;

    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    await customer.update({
      name: name || customer.name,
      email: email || customer.email,
      phone: phone || customer.phone,
      address: address || customer.address,
      city: city || customer.city,
      state: state || customer.state,
      postal_code: postal_code || customer.postal_code,
      country: country || customer.country,
      tax_id: tax_id || customer.tax_id,
      payment_terms: payment_terms || customer.payment_terms
    });

    res.json(customer);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update customer",
      error: error.message
    });
  }
}

async function deleteCustomer(req, res) {
  try {
    const { id } = req.params;

    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    await customer.destroy();
    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(400).json({
      message: "Failed to delete customer",
      error: error.message
    });
  }
}

module.exports = {
  getAllCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer
};
