const express = require("express");
const app = express();
const product = require("../controller/product");

// Add Product
app.post("/add", product.addProduct);

// Get All Products
app.post("/get/", product.getAllProducts);

// Delete Selected Product Item
app.post("/delete/:id", product.deleteSelectedProduct);

// approve selectd product
app.post("/approve/:id", product.approveSelectedProduct);

// Update Selected Product
app.post("/update", product.updateSelectedProduct);

// Search Product
app.post("/search", product.searchProduct);

// Get VIN
app.post("/getVIN", product.getVIN);

// http://localhost:4000/api/product/search?searchTerm=fa

module.exports = app;
