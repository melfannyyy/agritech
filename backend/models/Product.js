const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  category: {
    type: String,
    required: true,
    trim: true,
  },

  price: {
    type: Number,
    required: true,
  },

  description: {
    type: String,
    required: true,
    trim: true,
  },

  imgUrl: {
    type: String,
    required: true,
    trim: true,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;