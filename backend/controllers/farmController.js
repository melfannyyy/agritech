const Farm = require('../models/Farm');

exports.addFarm = async (req, res) => {
  const { userId, name, location, areaSize, cropType } = req.body;
  try {
    const newFarm = await Farm.create({ userId, name, location, areaSize, cropType });
    res.status(201).json(newFarm);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getFarmById = async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id);
    if (!farm) return res.status(404).json({ message: 'Farm not found' });
    res.status(200).json(farm);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllFarms = async (req, res) => {
  try {
    const farms = await Farm.find()
      .populate('userId', 'name email')
      .sort('-createdAt');
    res.status(200).json({ data: farms });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getFarmsByUserId = async (req, res) => {
  const userId = req.params.userId;
  try {
    const farms = await Farm.find({ userId }).sort('-createdAt');
    res.json(farms);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch farms' });
  }
};

exports.updateFarm = async (req, res) => {
  try {
    const farm = await Farm.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name, location: req.body.location, areaSize: req.body.areaSize, cropType: req.body.cropType },
      { new: true, runValidators: true }
    );
    if (!farm) return res.status(404).json({ message: 'Farm not found' });
    res.status(200).json(farm);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteFarm = async (req, res) => {
  try {
    const farm = await Farm.findByIdAndDelete(req.params.id);
    if (!farm) return res.status(404).json({ message: 'Farm not found' });
    res.status(200).json({ message: 'Farm deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
