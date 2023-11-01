const Product = require("../models/product");
const Sales = require("../models/sales");

// Add Post
const addProduct = (req, res) => {

  const existence = Product.findOne({
    vin: req.body.vin
  });
  console.log(existence);

  if (existence) {
    console.log('vin number already exists');
    res.status(402).send()
  } else {
    const addProduct = new Product({
      name: req.body.name,
      manufacturer: req.body.manufacturer,
      stock: 0,
      description: req.body.description,
    });
  
    addProduct
      .save()
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        res.status(402).send(err);
      });
  }


};

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

// Update Selected Product
const updateSelectedProduct = async (req, res) => {
  try {
    const updatedResult = await Product.findOneAndUpdate(
      { vin: req.body.vin },
      {
        manufacturer: req.body.manufacturer,
        model: req.body.model,
        year: req.body.year,
        purchaseDate: req.body.purchaseDate,
        condition: req.body.condition,
        initial: req.body.initial,
        additional: req.body.additional
      },
      { returnOriginal: false }
    );
    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(402).send();
  }
};

// Search Products
const searchProduct = async (req, res) => {
  const searchTerm = req.query.searchTerm;
  const products = await Product.find({
    vin: { $regex: searchTerm, $options: "i" },
  });
  res.json(products);
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

module.exports = {
  addProduct,
  getAllProducts,
  deleteSelectedProduct,
  approveSelectedProduct,
  updateSelectedProduct,
  searchProduct,
  getVIN,
};
