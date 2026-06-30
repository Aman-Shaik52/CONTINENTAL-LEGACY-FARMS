const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['fruit', 'vegetable', 'dairy', 'rare food'],
    required: true,
  },
  origin: {
    type: String,
    required: true,
  },
  rarityLevel: {
    type: String,
    enum: ['rare', 'ultra rare', 'extinct'],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
  isExtinctType: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);