const logger = require("../config/logger");
const Order = require("../model/Order");

const OrderController = {

  //Order placed by User
  postOrder: async (req, res) => {
    const {
      user_id,
      seller_id,
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
      const newOrder = await Order.create({
        user_id,
        seller_id,
        item_id,
        item_name,
        item_category,
        item_price,
        item_dsc,
        item_qty,
        item_image,
        item_discount,
        item_subtotal
      })

      return res.status(201).json({
        success: true,
        data: newOrder,
        message: "Order placed successfully"
      });

    } catch (error) {
      logger.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to place order",
        error: error.message
      });
    }
  },
  
  //get Order by id
  getOrderById : async (req,res) => {
    const {id} = req.params;
    try{
      const data = await Order.findById(id);

      if(!data){
        return res.status(500).json({
          success : false,
          message : "Order not found"
        })
      }

      return res.status(200).json({
        success : true,
        message : "Order fetched",
        data : data
      })

    }
    catch(error){
      logger.error(error);
      res.status(500).json({
        success : false,
        message : "server error",
        error : error.message
      })
    }
  },

  // Get Orders by user_id
  getMyOrder: async (req, res) => {
    const { id } = req.params;

    try {
      const orders = await Order.find({ user_id: id });
      const grandTotal = orders.reduce((sum, order) => sum + order.item_subtotal, 0);

      return res.status(200).json({
        success: true,
        data: orders,
        grandTotal,
        message: "My orders view"
      });

    } catch (error) {
      logger.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch orders",
        error: error.message
      });
    }
  },

  // Get Orders by seller_id
  getSellerOrder : async (req, res)=>{
    try{
      const id = req.params.sellerId;
      const data = await Order.find({seller_id : id});
      res.status(200).json({
          success : true,
          message : "Order fetched success",
          data : data
      })
    }

    catch(error){
      logger.error(error);
      res.status(500).json({
          success : false,
          message : "Internal server error",
          error : error.message
      })
    }
  },

  // Cancel Order by ID
  cancelOrder : async (req, res) => {
    const { id } = req.params;

    try {
      const deleted = await Order.findByIdAndDelete({_id : id});

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
      logger.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to cancel order",
        error: error.message
      });
    }
  }
}

module.exports = OrderController;