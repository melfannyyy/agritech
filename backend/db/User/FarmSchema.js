// models/Farm.js
const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  areaSize: { type: Number, required: true },
  cropType: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  userId:{type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName:{type:String,}
});

module.exports = mongoose.model('Farm', farmSchema);
