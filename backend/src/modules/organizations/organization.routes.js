const express = require("express");
const router = express.Router();

const organizationController = require("./organization.controller");

router.post("/", organizationController.createOrganization);

router.get("/", organizationController.getOrganizations);

module.exports = router;