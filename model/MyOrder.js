const mongoose = require('mongoose');

const MyOrderSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  item_id: {
    type: String,
    required: true,
  },
  item_name: {
    type: String,
    required: true,
  },
  item_category: {
    type: String,
    required: true,
  },
  item_price: {
    type: String, // You can change to Number for calculations
    required: true,
  },
  item_dsc: {
    type: String,
    required: true,
  },
  item_qty: {
    type: String, // Consider using Number
    required: true,
  },
  item_image: {
    type: String,
    required: true,
  },
  item_discount: {
    type: String,
    default: null,
  },
  item_subtotal: {
    type: String,
    required: true,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('MyOrder', MyOrderSchema);
