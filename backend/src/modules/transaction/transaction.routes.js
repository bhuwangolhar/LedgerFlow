const express = require("express");
const router = express.Router();
const transactionController = require("./transaction.controller");

router.post("/", transactionController.createTransaction);
router.get("/", transactionController.getTransactions);

module.exports = router;