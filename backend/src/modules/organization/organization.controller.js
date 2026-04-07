const organizationService = require("./organization.service");

async function createOrganization(req, res) {
  try {
    const userId = req.user.id;
    const org = await organizationService.createOrganization({
      ...req.body,
      user_id: userId
    });

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
    const orgs = await organizationService.getOrganizationsByUser(userId);

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