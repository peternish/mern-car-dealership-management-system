const express = require("express");
const app = express();
const proposal = require("../controller/proposal");

// Add Proposal
app.post("/add", proposal.addProposal);

// Get Proposal Data
app.post("/get", proposal.getAllProposals);

// Update Proposal Data
app.post("/update", proposal.updateProposal);

// Read Proposal
app.post('/read/:id', proposal.readProposal);

// get unread messages
app.post('/getunread', proposal.getUnreadMessage);

module.exports = app;
