const express = require("express");
const router = express.Router();

const organizationRoutes = require("../modules/organization/organization.routes");
const userRoutes = require("../modules/user/user.routes");
const accountRoutes = require("../modules/account/account.routes");

router.use("/organizations", organizationRoutes);
router.use("/users", userRoutes);
router.use("/accounts", accountRoutes);

module.exports = router;