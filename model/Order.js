const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
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
}, {
  timestamps: true
});

module.exports = mongoose.model("Order", OrderSchema);