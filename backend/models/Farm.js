const mongoose = require("mongoose");

const farmSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    areaSize: {
      type: String,
      required: true,
      trim: true,
    },

    cropType: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Farm = mongoose.model("Farm", farmSchema);

module.exports = Farm;
