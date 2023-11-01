const Proposal = require('../models/proposal');

// Add Proposal
const addProposal = (req, res) => {
    const addProposal = new Proposal({
      name: req.body.name,
      subject: req.body.subject,
      message: req.body.message,
      date: req.body.date,
      state: 'unread',
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
        { _id: req.body.id },
        {
          subject: req.body.subject,
          message: req.body.message,
          date: req.body.date,
          state: 'edited',
        },
        { returnOriginal: false }
      );
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
        const readResult = await Proposal.findByIdAndUpdate(
            req.params.id,
            {
                state: 'read',
            },
            {returnOriginal: false},
        );
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.status(402).send();
    }
}

// Get Unread Messages
const getUnreadMessage = async (req, res) => {
    try {
        const count = await Proposal.countDocuments({
            state: { $in: ['edited', 'unread'] },
        });
        res.json(count);
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    addProposal,
    getAllProposals,
    updateProposal,
    readProposal,
    getUnreadMessage,
};