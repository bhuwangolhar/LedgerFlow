const express = require("express");
const router = express.Router();

const authController = require("./auth.controller");

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.get("/verify", authController.verifyToken);

module.exports = router;
