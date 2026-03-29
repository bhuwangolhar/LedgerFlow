const express = require("express");
const router = express.Router();

const organizationRoutes = require("../modules/organization/organization.routes");
const userRoutes = require("../modules/user/user.routes");
const accountRoutes = require("../modules/account/account.routes");
const transactionRoutes = require("../modules/transaction/transaction.routes");

router.use("/organizations", organizationRoutes);
router.use("/users", userRoutes);
router.use("/accounts", accountRoutes);
router.use("/transactions", transactionRoutes);

module.exports = router;
