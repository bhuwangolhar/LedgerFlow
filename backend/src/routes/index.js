const express = require("express");
const router = express.Router();

const organizationRoutes = require("../modules/organization/organization.routes");
const userRoutes = require("../modules/user/user.routes");

router.use("/organizations", organizationRoutes);
router.use("/users", userRoutes);

module.exports = router;



