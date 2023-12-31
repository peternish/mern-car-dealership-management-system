const express = require("express");
const app = express();
const sales = require("../controller/sales");

// Add Sales
app.post("/add", sales.addSales);

// Get All Sales
app.post("/get/", sales.getSalesData);

// get monthly sales
app.post("/getmonthly", sales.getMonthlySales);

// get total sales amount
app.post("/totalsalesamount", sales.getTotalSalesAmount);

// approve the sales of a product
app.post("/approve/:id", sales.approveSelectedSale);

// get not approved sales data
app.post("/getnotification", sales.getNotification);

module.exports = app;



// http://localhost:4000/api/sales/add POST
// http://localhost:4000/api/sales/get GET
