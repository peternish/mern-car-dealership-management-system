const express = require("express");
const app = express();
const sales = require("../controller/sales");

// Add Sales
app.post("/add", sales.addSales);

// Get All Sales
app.post("/get/", sales.getSalesData);
// app.post("/getmonthly", sales.getMonthlySales);


app.post("/totalsalesamount", sales.getTotalSalesAmount);

module.exports = app;



// http://localhost:4000/api/sales/add POST
// http://localhost:4000/api/sales/get GET
