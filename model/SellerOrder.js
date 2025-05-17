const mongoose = require("mongoose");

const SellerOrderSchema = new mongoose.Schema({
  seller_id :{
    type :mongoose.Schema.Types.ObjectId,
    ref:'User',
    required : true
  },
  user_id : {
    type :mongoose.Schema.Types.ObjectId,
    ref:'User',
    required : true
  },
  user_name : {
    type : String,
    required : true
  },
  item_id: {
    type :mongoose.Schema.Types.ObjectId,
    ref:'Item',
    required : true
  },
  order_id : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'MyOrder',
    required : true
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
    type: Number,
    required: true,
  },
  item_dsc: {
    type: String,
    required: true,
  },
  item_qty: {
    type: Number,
    required: true,
  },
  item_image: {
    type: String,
    required: true,
  },
  item_discount: {
    type: Number,
    default: null,
  },
  item_subtotal: {
    type: Number,
    required: true,
  },
  order_status: {
    type: String,
    enum: ["Pending", "Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered", "Cancelled" ],
    default: "Pending"
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("sellerOrder", SellerOrderSchema);