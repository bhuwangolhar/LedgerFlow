const express = require("express");
const router = express.Router();

const organizationController = require("./organization.controller");
const authMiddleware = require("../../middleware/authMiddleware");

router.post("/", authMiddleware, organizationController.createOrganization);

router.get("/", authMiddleware, organizationController.getOrganizations);

module.exports = router;