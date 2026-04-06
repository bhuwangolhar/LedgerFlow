const express = require("express");
const router = express.Router();

const authRoutes = require("../modules/auth/auth.routes");
const organizationRoutes = require("../modules/organization/organization.routes");
const userRoutes = require("../modules/user/user.routes");
const accountRoutes = require("../modules/account/account.routes");
const transactionRoutes = require("../modules/transaction/transaction.routes");
const financeRoutes = require("../modules/finance/finance.routes");

router.use("/auth", authRoutes);
router.use("/organizations", organizationRoutes);
router.use("/users", userRoutes);
router.use("/accounts", accountRoutes);
router.use("/transactions", transactionRoutes);
router.use("/finance", financeRoutes);

module.exports = router;
