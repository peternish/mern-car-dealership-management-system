const mongoose = require("mongoose");

const SaleSchema = new mongoose.Schema(
  {
    vin: {
      type: mongoose.Schema.Types.String,
      ref: "product",
      required: true,
    },
    SalesDate: {
      type: String,
      required: true,
    },
    PaymentType: {
      type: String,
      required: true,
    },
    Price: {
      type: Number,
      required: true,
    },
    Income: {
      type: Number,
    }
  },
  { timestamps: true }
);

const Sales = mongoose.model("sales", SaleSchema);
module.exports = Sales;
