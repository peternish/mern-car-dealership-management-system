const Product = require("../models/product");

// Add Purchase Details
const addPurchase = (req, res) => {
  const addPurchaseDetails = new Product({
    userID: req.body.userID,
    vin: req.body.vin,
    manufacturer: req.body.manufacturer,
    year: req.body.year,
    model: req.body.model,
    purchaseDate: req.body.purchaseDate,
    condition: req.body.condition,
    initial: req.body.initial,
    additional: req.body.additional,
    state: 'not on sale'
  });

  addPurchaseDetails
    .save()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(402).send(err);
    });
};

// Get All Purchase Data
const getPurchaseData = async (req, res) => {
  const findAllPurchaseData = await Product.find()
    .sort({ _id: -1 })
    .populate("vin"); // -1 for descending order
  res.json(findAllPurchaseData);
};

module.exports = { addPurchase, getPurchaseData };
