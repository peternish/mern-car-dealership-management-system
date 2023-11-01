const Sales = require("../models/sales");
const Product = require("../models/product");

// Add Sales
const addSales = async (req, res) => {
  try {
    let product = await Sales.findOne({
      vin: req.body.vinNumber,
    })

    if (!product) {
      await new Sales({
        vin: req.body.vinNumber,
        salesDate: [req.body.salesDate],
        paymentType: req.body.paymentType,
        price: req.body.price,
        income: [req.body.income],
      }).save();
    
      await Product.findOneAndUpdate(
        {vin: req.body.vinNumber},
        {state: 'sold'},
        {returnOriginal: false},
      );

    } else {
      product.salesDate.push(req.body.salesDate);
      product.income.push(req.body.income);
      await product.save();
    }
    res.status(200).send();
  } catch (err) {
    console.log(err);
    res.status(402).send();
  }
};

// Get All Sales Data
const getSalesData = async (req, res) => {
  const findAllSalesData = await Sales.find()
    .sort({ _id: -1 });
  res.json(findAllSalesData);
};

// Get total sales amount
const getTotalSalesAmount = async(req,res) => {
  let totalSaleAmount = 0;
  let normal = 0;
  let good = 0;
  let bad = 0;
  const salesData = await Sales.find();
  salesData.forEach((sale)=>{
    totalSaleAmount += sale.income.reduce((partialSum, a) => parseInt(partialSum) + parseInt(a), 0);
    sale.price <= sale.income.reduce((partialSum, a) => parseInt(partialSum) + parseInt(a), 0) 
    ?
    good += 1
    :
    0.7 * sale.price <= sale.income.reduce((partialSum, a) => parseInt(partialSum) + parseInt(a), 0)
    ?
    normal += 1
    :
    bad += 1
  })
  res.json({
    total: totalSaleAmount,
    good: good,
    normal: normal,
    bad: bad,
  });

}

const getMonthlySales = async (req, res) => {
  try {
    const sales = await Sales.find();

    // Initialize the sales amount
    let salesAmount = {
      '2023': Array(12).fill(0), 
      '2024': Array(12).fill(0), 
      '2025': Array(12).fill(0),
    }

    sales.forEach((sale) => {
      sale.salesDate.forEach((date, i) => {
        const year = date.split("-")[0];
        const monthIndex = parseInt(date.split("-")[1]) - 1;
        salesAmount[year][monthIndex] += parseInt(sale.income[i]);
      })
    });
    res.status(200).json(salesAmount);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};



module.exports = { addSales, getMonthlySales, getSalesData,  getTotalSalesAmount};
