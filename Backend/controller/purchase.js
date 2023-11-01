const Product = require("../models/product");

// Add Purchase Details
const addPurchase = async (req, res) => {
  try {
    const existence = await Product.findOne({ vin: req.body.vin });
    if (!existence) {
      const addPurchaseDetails = new Product({
        vin: req.body.vin,
        manufacturer: req.body.manufacturer,
        year: req.body.year,
        model: req.body.model,
        purchaseDate: req.body.purchaseDate,
        condition: req.body.condition,
        initial: req.body.initial,
        state: 'not on sale',
      });
      const result = await addPurchaseDetails.save();
      res.status(200).send(result);
    } else {
      res.status(402).send();
    }
  } catch (err) {
    res.status(402).send(err);
  }
};

// Get All Purchase Data
const getPurchaseData = async (req, res) => {
  const findAllPurchaseData = await Product.find({
    state: { $in: ['on sale', 'not on sale'] }
  })
    .sort({ _id: -1 })
    .populate("vin"); // -1 for descending order
  res.json(findAllPurchaseData);
};

// Get total purchase amount
const getTotalPurchaseAmount = async (req, res) => {
  let totalPurchaseAmount = 0;
  const purchaseData = await Product.find();
  purchaseData.forEach((purchase) => {
    totalPurchaseAmount += (purchase.initial + purchase.additional.reduce((sum, a) => sum + parseInt(a.amount), 0));
  });
  res.json({ totalPurchaseAmount });
};

module.exports = { addPurchase, getPurchaseData, getTotalPurchaseAmount };
