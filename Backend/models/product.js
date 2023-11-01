const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    vin: {
      type: String,
      required: true,
    },
    manufacturer: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    purchaseDate: {
      type: Date,
      required: true,
    },
    condition: {
      type: String,
      required: true,
    },
    initial: {
      type: Number,
      required: true,
    },
    additional: {
      type: Array,
    },
    state: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);


const Product = mongoose.model("product", ProductSchema);
module.exports = Product;
