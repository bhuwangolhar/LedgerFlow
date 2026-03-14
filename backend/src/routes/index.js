const express = require("express");
const router = express.Router();

const organizationRoutes = require("../modules/organizations/organization.routes");

router.use("/organizations", organizationRoutes);

module.exports = router;