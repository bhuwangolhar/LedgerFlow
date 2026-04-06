const Vendor = require("../../models/vendor.model");

async function getAllVendors(req, res) {
  try {
    const { organization_id } = req.query;
    
    const vendors = await Vendor.findAll({
      where: { organization_id }
    });

    res.json(vendors);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch vendors",
      error: error.message
    });
  }
}

async function createVendor(req, res) {
  try {
    const { name, email, phone, address, city, state, postal_code, country, tax_id, payment_terms, organization_id } = req.body;

    if (!name || !organization_id) {
      return res.status(400).json({
        message: "Name and organization_id are required"
      });
    }

    // Generate vendor_no
    const lastVendor = await Vendor.findOne({
      order: [['created_at', 'DESC']]
    });
    let nextNum = 1;
    if (lastVendor && lastVendor.vendor_no) {
      const match = lastVendor.vendor_no.match(/VEND-(\d+)/);
      if (match) nextNum = parseInt(match[1]) + 1;
    }
    const vendor_no = `VEND-${String(nextNum).padStart(4, "0")}`;

    const vendor = await Vendor.create({
      organization_id,
      vendor_no,
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

    res.status(201).json(vendor);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create vendor",
      error: error.message
    });
  }
}

async function updateVendor(req, res) {
  try {
    const { id } = req.params;
    const { name, email, phone, address, city, state, postal_code, country, tax_id, payment_terms } = req.body;

    const vendor = await Vendor.findByPk(id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    await vendor.update({
      name: name || vendor.name,
      email: email || vendor.email,
      phone: phone || vendor.phone,
      address: address || vendor.address,
      city: city || vendor.city,
      state: state || vendor.state,
      postal_code: postal_code || vendor.postal_code,
      country: country || vendor.country,
      tax_id: tax_id || vendor.tax_id,
      payment_terms: payment_terms || vendor.payment_terms
    });

    res.json(vendor);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update vendor",
      error: error.message
    });
  }
}

async function deleteVendor(req, res) {
  try {
    const { id } = req.params;

    const vendor = await Vendor.findByPk(id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    await vendor.destroy();
    res.json({ message: "Vendor deleted successfully" });
  } catch (error) {
    res.status(400).json({
      message: "Failed to delete vendor",
      error: error.message
    });
  }
}

module.exports = {
  getAllVendors,
  createVendor,
  updateVendor,
  deleteVendor
};
