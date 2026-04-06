const Organization = require("../../models/organization.model");

async function createOrganization(data) {
  const org = await Organization.create({
    name: data.name,
    user_id: data.user_id
  });

  return org;
}

async function getOrganizations() {
  const orgs = await Organization.findAll({
    order: [["created_at", "DESC"]]
  });

  return orgs;
}

async function getOrganizationsByUser(user_id) {
  const orgs = await Organization.findAll({
    where: { user_id },
    order: [["created_at", "DESC"]]
  });

  return orgs;
}

module.exports = {
  createOrganization,
  getOrganizations,
  getOrganizationsByUser
};