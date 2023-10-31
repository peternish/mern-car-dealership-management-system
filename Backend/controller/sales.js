const Sales = require("../models/sales");
const Product = require("../models/product");

// Add Sales
const addSales = async (req, res) => {
  try {
    let product = await Sales.findOne({
      vin: req.body.vinNumber,
    })

    if (!product) {
      console.log('ewe');
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
  const salesData = await Sales.find({"userID": req.params.userID});
  salesData.forEach((sale)=>{
    totalSaleAmount += sale.TotalSaleAmount;
  })
  res.json({totalSaleAmount});

}

const getMonthlySales = async (req, res) => {
  try {
    const sales = await Sales.find();

    // Initialize array with 12 zeros
    const salesAmount = [];
    salesAmount.length = 12;
    salesAmount.fill(0)

    sales.forEach((sale) => {
      const monthIndex = parseInt(sale.SaleDate.split("-")[1]) - 1;

      salesAmount[monthIndex] += sale.TotalSaleAmount;
    });

    res.status(200).json({ salesAmount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};



module.exports = { addSales, getMonthlySales, getSalesData,  getTotalSalesAmount};
