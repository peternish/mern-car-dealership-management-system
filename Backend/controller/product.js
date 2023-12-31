const Product = require("../models/product");
const Sales = require("../models/sales");

// Get All Products
const getAllProducts = async (req, res) => {
  const findAllProducts = await Product.find({
    state: { $in: ['not on sale', 'on sale'] },
  }).sort({ _id: -1 }); // -1 for descending;
  res.json(findAllProducts);
};

// Delete Selected Product
const deleteSelectedProduct = async (req, res) => {
  const deleteProduct = await Product.deleteOne(
    { _id: req.params.id }
  );
  const deletePurchaseProduct = await Product.deleteOne(
    { ProductID: req.params.id }
  );

  const deleteSaleProduct = await Sales.deleteOne(
    { ProductID: req.params.id }
  );
  res.json({ deleteProduct, deletePurchaseProduct, deleteSaleProduct });
};

// Approve Selected Product
const approveSelectedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    const newState = product.state === 'not on sale' ? 'on sale' : 'not on sale';
    product.state = newState;
    await product.save();
    res.status(200).send();
  } catch (err) {
    console.log(err);
    res.status(402).send();
  }
};

// Approve Selected Expense
const approveSelectedExpense = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send("Product not found");
    }

    const newState = 'approved';
    for (i in product.additional) {
      product.additional[i].state = newState;
    };
    product.markModified('additional');
    await product.save();
    res.status(200).send('success');
  } catch (err) {
    console.log(err);
    res.status(402).send();
  }
};

// Update Selected Product
const updateSelectedProduct = async (req, res) => {
  try {
    await Product.findOneAndUpdate(
      { vin: req.body.vin },
      {
        manufacturer: req.body.manufacturer,
        model: req.body.model,
        year: req.body.year,
        purchaseDate: req.body.purchaseDate,
        condition: req.body.condition,
        initial: req.body.initial,
      },
      { returnOriginal: false }
    );
    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(402).send();
  }
};

//  Get VIN Numbers of cars on sale
const getVIN = async (req, res) => {
  let vin = [];
  const result = await Product.find({
    state: 'on sale',   
  });
  for (i in result) {
    vin.push(result[i].vin);
  }
  res.json(vin);
}

// Add Additional Expense
const addExpense = async (req, res) => {
  try {
    const product = await Product.findOne(
      {vin: req.body.vin}
    );
    if (!product) {
      res.status(402).send();
    }
    const newAdditional = product.additional.concat(
      {
        date: req.body.date,
        amount: req.body.amount,
        reason: req.body.reason,
        state: 'not approved',
      }
    )
    product.additional = newAdditional;
    product.save();
    res.status(200).send();
  } catch (err) {
    console.log(err);
    res.status(402).send();
  }
}

module.exports = {
  getAllProducts,
  deleteSelectedProduct,
  approveSelectedProduct,
  approveSelectedExpense,
  updateSelectedProduct,
  getVIN,
  addExpense,
};
