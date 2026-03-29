const Organization = require("../../models/organization.model");

async function createOrganization(data) {
  const org = await Organization.create({
    name: data.name
  });

  return org;
}

async function getOrganizations() {
  const orgs = await Organization.findAll({
    order: [["created_at", "DESC"]]
  });

  return orgs;
}

module.exports = {
  createOrganization,
  getOrganizations
};