const MyOrder = require('../model/MyOrder');
const Item = require("../model/Item");
const User = require("../model/Users");
const sellerOrder = require("../model/SellerOrder");

const MyOrdersController = {
  // Add My Order
  postMyOrder: async (req, res) => {
    const {
      user_id,
      item_id,
      item_category,
      item_name,
      item_price,
      item_dsc,
      item_qty,
      item_image,
      item_discount,
      item_subtotal
    } = req.body;

    try {
      const newOrder = await MyOrder.create({
        user_id,
        item_id,
        item_category,
        item_name,
        item_price,
        item_dsc,
        item_qty,
        item_image,
        item_discount,
        item_subtotal
      });

      const item = await Item.findById(item_id);
      const user = await User.findById(user_id);
      

      await sellerOrder.create({
        seller_id : item.seller_id,
        item_id,
        user_name : user.name,
        item_category,
        item_name,
        item_price,
        item_dsc,
        item_qty,
        item_image,
        item_discount,
        item_subtotal
      });

      return res.status(201).json({
        success: true,
        myOrder: newOrder,
        message: "Order placed successfully"
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to place order",
        error: error.message
      });
    }
  },

  // Get My Orders by user_id
  getMyOrder: async (req, res) => {
    const { id } = req.params;

    try {
      const orders = await MyOrder.find({ user_id: id });
      const grandTotal = orders.reduce((sum, order) => sum + order.item_subtotal, 0);

      return res.status(200).json({
        success: true,
        data: orders,
        grandTotal,
        message: "My orders view"
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch orders",
        error: error.message
      });
    }
  },

  // Cancel Order by ID
  cancelOrder: async (req, res) => {
    const { id } = req.params;

    try {
      const deleted = await MyOrder.findByIdAndDelete({_id : id});

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Order not found"
        });
      }

      return res.status(200).json({
        success: true,
        message: "Order cancelled"
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to cancel order",
        error: error.message
      });
    }
  }
};

module.exports = MyOrdersController;
