const express = require("express");
const app = express();
const product = require("../controller/product");

// Get All Products
app.post("/get/", product.getAllProducts);

// Delete Selected Product Item
app.post("/delete/:id", product.deleteSelectedProduct);

// approve selectd product
app.post("/approve/:id", product.approveSelectedProduct);

// apprive selected expense
app.post('/approveexpense/:id', product.approveSelectedExpense);

// Update Selected Product
app.post("/update", product.updateSelectedProduct);

// Get VIN
app.post("/getVIN", product.getVIN);

// Add Additional Expense
app.post('/addexpense', product.addExpense);

// http://localhost:4000/api/product/search?searchTerm=fa

module.exports = app;
