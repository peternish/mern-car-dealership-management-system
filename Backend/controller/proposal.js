const Proposal = require('../models/proposal');

// Add Proposal
const addProposal = (req, res) => {
    const addProposal = new Proposal({
      name: req.body.name,
      subject: req.body.subject,
      message: req.body.message,
      date: req.body.date,
      state: 'not read',
    });
  
    addProposal
      .save()
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(402).send(err);
      });
  };

// Get All Proposals
const getAllProposals = async (req, res) => {
    const findAllProposals = await Proposal.find();
    res.json(findAllProposals);
  };

// Update Proposal
const updateProposal = async (req, res) => {
    try {
      const updatedResult = await Proposal.findOneAndUpdate(
        { name: req.body.name },
        {
          subject: req.body.subject,
          message: req.body.message,
          date: req.body.date,
          state: 'edited',
        },
        { returnOriginal: false }
      );
      console.log(updatedResult);
      res.status(200).send();
    } catch (error) {
      console.log(error);
      res.status(402).send();
    }
  };

// Read Proposal
const readProposal = async (req, res) => {
    try {
        const name = req.params.name;
        console.log(res);
        const readResult = await Proposal.findOneAndUpdate(
            {name: name},
            {
                state: 'read',
            },
            {returnOriginal: false},
        );
        console.log(readResult);
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.status(402).send();
    }
}

  module.exports = {
    addProposal,
    getAllProposals,
    updateProposal,
    readProposal,
  };