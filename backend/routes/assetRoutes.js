// backend/routes/assetRoutes.js

const express = require('express');
const router = express.Router();
const Asset = require('../models/Asset');

// Get all assets
router.get('/', async (req, res) => {
  try {
    const assets = await Asset.find();
    res.json(assets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assets.', error });
  }
});

// Add a new asset
router.post('/', async (req, res) => {
  const { assetName, assetCode, assetStatus } = req.body;

  if (!assetName || !assetCode) {
    return res.status(400).json({ message: 'Asset name and code are required.' });
  }

  try {
    const newAsset = new Asset({ assetName, assetCode, assetStatus });
    const savedAsset = await newAsset.save();
    res.status(201).json(savedAsset);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Asset code already exists.' });
    }
    res.status(500).json({ message: 'Error adding the asset.', error });
  }
});

// Delete an asset
router.delete('/:id', async (req, res) => {
  try {
    const deletedAsset = await Asset.findByIdAndDelete(req.params.id);
    if (!deletedAsset) {
      return res.status(404).json({ message: 'Asset not found.' });
    }
    res.json({ message: 'Asset deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting the asset.', error });
  }
});

// Update Asset API Route
router.put('/:id', async (req, res) => {
  const { assetName, assetCode, assetStatus } = req.body;

  if (!assetName || !assetCode) {
    return res.status(400).json({ message: 'Asset name and code are required.' });
  }

  try {
    const updatedAsset = await Asset.findByIdAndUpdate(
      req.params.id,
      { assetName, assetCode, assetStatus },
      { new: true }  // Return updated document
    );
    
    if (!updatedAsset) {
      return res.status(404).send({ message: "Asset not found" });
    }

    res.status(200).json(updatedAsset);  // Successfully updated asset

  } catch (error) {
    console.error("Error updating asset:", error);
    res.status(500).send({ message: "Error updating asset" });
  }
});

module.exports = router;
