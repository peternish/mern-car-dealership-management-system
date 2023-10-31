const mongoose = require("mongoose");

const SaleSchema = new mongoose.Schema(
  {
    vin: {
      type: String,
      required: true,
    },
    salesDate: {
      type: Array,
      required: true,
    },
    paymentType: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    income: {
      type: Array,
    }
  },
  { timestamps: true }
);

const Sales = mongoose.model("sales", SaleSchema);
module.exports = Sales;
