const User = require("../../models/user.model");

async function createUser(data) {
  const user = await User.create({
    organization_id: data.organization_id,
    name: data.name,
    email: data.email
  });

  return user;
}

async function getUsers(organization_id) {
  const where = organization_id ? { organization_id } : {};

  const users = await User.findAll({
    where,
    order: [["created_at", "DESC"]]
  });

  return users;
}

module.exports = {
  createUser,
  getUsers
};