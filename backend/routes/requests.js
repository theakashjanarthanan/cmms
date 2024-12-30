// backend\routes\requests.js

const express = require('express');
const router = express.Router();
const Request = require('../models/Request');

// Create a new request
router.post('/', async (req, res) => {
  try {
    const newRequest = new Request(req.body);
    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all requests
router.get('/', async (req, res) => {
  try {
    const requests = await Request.find();
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a request
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, priority, status, assignedTo } = req.body;

  // Validation check to ensure required data is provided
  if (!title || !description || !priority || !status || !assignedTo) {
    return res.status(400).json({ message: 'All fields are required to update the request.' });
  }

  try {
    // Find and update the request by ID
    const updatedRequest = await Request.findByIdAndUpdate(
      id,
      { title, description, priority, status, assignedTo },
      { new: true } // Return the updated document
    );

    // If the request ID is invalid or not found, send a 404 error
    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found.' });
    }

    res.status(200).json(updatedRequest); // Respond with the updated request
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating the request. Please try again.' });
  }
});

// Delete a request
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Find and delete the request by ID
    const deletedRequest = await Request.findByIdAndDelete(id);

    if (!deletedRequest) {
      return res.status(404).json({ message: 'Request not found to delete.' });
    }

    res.status(200).send({ message: 'Request deleted successfully' });
  } catch (err) {
    res.status(500).send({ message: 'Error deleting request' });
  }
});

module.exports = router;
