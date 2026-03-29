const Account = require("../../models/account.model");

async function createAccount(data) {
  const account = await Account.create({
    organization_id: data.organization_id,
    name: data.name,
    type: data.type,
  });

  return account;
}

async function getAccounts(organization_id) {
  const where = organization_id ? { organization_id } : {};

  const accounts = await Account.findAll({
    where,
    order: [["created_at", "DESC"]],
  });

  return accounts;
}

module.exports = {
  createAccount,
  getAccounts,
};