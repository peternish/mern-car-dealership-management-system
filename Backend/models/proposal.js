const mongoose = require("mongoose");

const ProposalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
  },
  { timestamps: true }
);

const Proposal = mongoose.model("proposal", ProposalSchema);
module.exports = Proposal;
