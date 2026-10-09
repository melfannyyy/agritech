const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  variety: {
    type: String,
    required: true   
  },
  quantity: {
    type: Number,
    required: true
  },
  plantedDate: {
    type: Date,
    required: true
  },
  estimatedHarvestDate: {
    type: Date,
    required: true
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName:String,

});

module.exports = mongoose.model('Crop', cropSchema);
