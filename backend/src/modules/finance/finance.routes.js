const express = require("express");
const router = express.Router();

const customerController = require("./customer.controller");
const vendorController = require("./vendor.controller");
const invoiceController = require("./invoice.controller");
const billController = require("./bill.controller");
const paymentReceivedController = require("./paymentReceived.controller");
const paymentMadeController = require("./paymentMade.controller");
const bankAccountController = require("./bankAccount.controller");

// Customer routes
router.get("/customers", customerController.getAllCustomers);
router.post("/customers", customerController.createCustomer);
router.put("/customers/:id", customerController.updateCustomer);
router.delete("/customers/:id", customerController.deleteCustomer);

// Vendor routes
router.get("/vendors", vendorController.getAllVendors);
router.post("/vendors", vendorController.createVendor);
router.put("/vendors/:id", vendorController.updateVendor);
router.delete("/vendors/:id", vendorController.deleteVendor);

// Invoice routes
router.get("/invoices", invoiceController.getAllInvoices);
router.post("/invoices", invoiceController.createInvoice);
router.put("/invoices/:id", invoiceController.updateInvoice);
router.delete("/invoices/:id", invoiceController.deleteInvoice);

// Bill routes
router.get("/bills", billController.getAllBills);
router.post("/bills", billController.createBill);
router.put("/bills/:id", billController.updateBill);
router.delete("/bills/:id", billController.deleteBill);

// Payment Received routes
router.get("/payments-received", paymentReceivedController.getAllPaymentsReceived);
router.post("/payments-received", paymentReceivedController.createPaymentReceived);
router.put("/payments-received/:id", paymentReceivedController.updatePaymentReceived);
router.delete("/payments-received/:id", paymentReceivedController.deletePaymentReceived);

// Payment Made routes
router.get("/payments-made", paymentMadeController.getAllPaymentsMade);
router.post("/payments-made", paymentMadeController.createPaymentMade);
router.put("/payments-made/:id", paymentMadeController.updatePaymentMade);
router.delete("/payments-made/:id", paymentMadeController.deletePaymentMade);

// Bank Account routes
router.get("/bank-accounts", bankAccountController.getAllBankAccounts);
router.post("/bank-accounts", bankAccountController.createBankAccount);
router.get("/bank-accounts/:id", bankAccountController.getBankAccountById);
router.put("/bank-accounts/:id", bankAccountController.updateBankAccount);
router.delete("/bank-accounts/:id", bankAccountController.deleteBankAccount);
router.post("/bank-accounts/:id/verify-pin", bankAccountController.verifyPinAndGetBalance);

module.exports = router;
