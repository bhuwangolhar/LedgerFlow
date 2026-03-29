const userService = require("./user.service");

async function createUser(req, res) {
  try {
    const user = await userService.createUser(req.body);

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create user",
      error: error.message
    });
  }
}

async function getUsers(req, res) {
  try {
    const { organization_id } = req.query;

    const users = await userService.getUsers(organization_id);

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message
    });
  }
}

module.exports = {
  createUser,
  getUsers
};