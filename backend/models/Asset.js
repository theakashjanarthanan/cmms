// backend\models\Asset.js

const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  assetName: { type: String, required: true },
  assetCode: { type: String, required: true, unique: true },
  assetStatus: { type: String, required: true, default: 'Available' },
});

module.exports = mongoose.model('Asset', assetSchema);
