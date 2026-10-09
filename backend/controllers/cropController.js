const Crop = require('../models/Crop');
const fs = require('fs');
const path = require('path');

exports.getCropsData = (req, res) => {
  fs.readFile(path.join(__dirname, '../db/crops.json'), 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Error reading file' });
    res.json(JSON.parse(data));
  });
};

exports.getCropByName = (req, res) => {
  fs.readFile(path.join(__dirname, '../db/crops.json'), 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Error reading file' });
    const crops = JSON.parse(data);
    const crop = crops.find(c => c.name.toLowerCase() === req.params.name.toLowerCase());
    if (!crop) return res.status(404).json({ message: 'Crop not found' });
    res.json(crop);
  });
};

exports.getCropById = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) return res.status(404).json({ message: 'Crop not found' });
    res.json(crop);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCropsByUserId = async (req, res) => {
  const userId = req.params.userId;
  try {
    const crops = await Crop.find({ userId }).sort('-createdAt');
    res.json(crops);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch crops' });
  }
};

exports.getAllCrops = async (req, res) => {
  try {
    const crops = await Crop.find().sort('-createdAt');
    res.json({ data: crops });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch crops' });
  }
};

exports.addCrop = async (req, res) => {
  const { userId, cropName, variety, quantity, plantedDate, estimatedHarvestDate } = req.body;
  try {
    const newCrop = await Crop.create({ userId, cropName, variety, quantity, plantedDate, estimatedHarvestDate });
    res.status(201).json(newCrop);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateCrop = async (req, res) => {
  try {
    const { cropName, variety, quantity, plantedDate, estimatedHarvestDate } = req.body;
    const crop = await Crop.findByIdAndUpdate(
      req.params.id,
      { cropName, variety, quantity, plantedDate, estimatedHarvestDate },
      { new: true, runValidators: true }
    );
    if (!crop) return res.status(404).json({ message: 'Crop not found' });
    res.json(crop);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteCrop = async (req, res) => {
  try {
    const crop = await Crop.findByIdAndDelete(req.params.id);
    if (!crop) return res.status(404).json({ message: 'Crop not found' });
    res.json({ message: 'Crop deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
