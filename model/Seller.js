const mongoose = require('mongoose');

const SellerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  phone: {
    type: String,
    unique: true,
    default: null,
  },
  email_verified_at: {
    type: Date,
    default: null,
  },
  password: {
    type: String,
    default: null,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Seller', SellerSchema);
