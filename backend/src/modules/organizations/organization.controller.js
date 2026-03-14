const organizationService = require("./organization.service");

async function createOrganization(req, res) {
  try {
    const org = await organizationService.createOrganization(req.body);

    res.status(201).json(org);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create organization",
      error: error.message
    });
  }
}

async function getOrganizations(req, res) {
  try {
    const orgs = await organizationService.getOrganizations();

    res.json(orgs);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch organizations",
      error: error.message
    });
  }
}

module.exports = {
  createOrganization,
  getOrganizations
};