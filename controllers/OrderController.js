const Order = require("../model/Order");

const OrderController = {
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
            console.log(error);
            res.status(500).json({
                success : false,
                message : "Internal server error",
                error : error.message
            })
        }
    },

    updateOrderStatus : async (req, res) => {
        const id = req.params.id;
        const { order_status } = req.body;
    
        const allowedStatuses = [
          "Pending",
          "Confirmed",
          "Packed",
          "Shipped",
          "Out for Delivery",
          "Delivered",
          "Cancelled"
        ];
    
        if(!allowedStatuses.includes(order_status)) {
          return res.status(400).json({
            success : false,
            message: "Invalid status" 
          });
        }
    
    
        try {
          const order = await Order.findByIdAndUpdate(
            id,
            { order_status },
            { new: true }
          );
    
          if (!order) {
            return res.status(404).json({
              success : false,
              message : "Order not found" 
            });
          }
    
          res.status(200).json({
            success : true,
            message : "Order status updated",
            order 
          });
        } catch (error) {
            console.log(error);
            res.status(500).json({ 
                success: false,
                message: "Server error",
                error: error.message 
            });
        }
    }

}

module.exports = sellerOrderController;