const { loggers } = require('winston');
const AddToCart = require('../model/AddToCart'); // Import the Mongoose model

const AddToCartController = {

  // Add Item to Cart
  addToCart: async (req, res) => {
    const { user_id, item_id, item_name, item_category, item_price, item_dsc, item_qty, item_image, item_discount } = req.body;
    console.log(user_id);
    console.log(item_id);
    try {
      // Calculate the subtotal
      const item_total = item_price * item_qty;
      const item_disc = (item_total / 100) * item_discount;
      const item_subtotal = item_total - item_disc;


      const data = await AddToCart.create({
        user_id,
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

      // Optionally, you can store it in the session if needed
      // let cartItems = req.session.cartItems || [];
      // cartItems.push(data);
      // req.session.cartItems = cartItems;

      // Calculate the grand total
      // let grandTotal = 0;
      // cartItems.forEach(cartItem => {
      //   grandTotal += cartItem.item_subtotal;
      // });

      return res.status(201).json({
        success: true,
        message: "Cart Data Added",
        data: data
      });
      
    } catch (error) {
      console.log(error);
      
      return res.status(500).json({
        success: false,
        message: "Failed to add product to cart",
        error: error.message
      });
    }
  },

  // Get Cart Data for All Users
  getCartData: async (req, res) => {
    try {
      const addCart = await AddToCart.find({});
      
      let grandTotal = 0;
      addCart.forEach(cartItem => {
        grandTotal += cartItem.item_subtotal;
      });

      return res.status(200).json({
        success: true,
        message: "Cart Data View",
        data: addCart,
        grandTotal
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch cart data",
        error: error.message
      });
    }
  },

  // Get Cart Data by User ID
  getCartDataByUserId: async (req, res) => {
    const { id } = req.params;

    try {
      const addCart = await AddToCart.find({ user_id: id });
      
      let grandTotal = 0;
      addCart.forEach(cartItem => {
        grandTotal += cartItem.item_subtotal;
      });

      return res.status(200).json({
        success: true,
        message: "Cart Data View",
        data: addCart,
        grandTotal
      });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch cart data for user",
            error: error.message
        });
    }
  },

  // Update Quantity (Increase)
  updateQuantityPlus: async (req,res) => {
    const { id } = req.params;

    try {
      const updateQuantity = await AddToCart.findById(id);
      if (!updateQuantity) {
        return res.status(500).json({
          success: false,
          message: "Item not found",
        });
      }

      updateQuantity.item_qty += 1;

      const item_total = updateQuantity.item_price * updateQuantity.item_qty;
      const item_disc = (item_total / 100) * updateQuantity.item_discount;
      updateQuantity.item_subtotal = item_total - item_disc;

      const data = await AddToCart.findByIdAndUpdate(
        {_id : id},
        updateQuantity,
        {new : true}
      );
      return res.status(200).json({
        success: true,
        message: "Cart Quantity Updated",
        result: data
      })

    } catch (error) {
      loggers.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to update cart quantity",
        error: error.message
      });
    }
  },

  // Update Quantity (Decrease)
  updateQuantityMinus: async (req, res) => {
    const { id } = req.params;

    try {
      const updateQuantity = await AddToCart.findById(id);

      if (!updateQuantity) {
        return res.status(404).json({
          success: false,
          message: "Item not found in cart"
        });
      }
      updateQuantity.item_qty -= 1;

     // Delete the item if quantity is zero
      if (updateQuantity.item_qty === 0) {
        const data = await AddToCart.findByIdAndDelete(id);

        return res.status(200).json({
          success: true,
          message: "Cart Quantity Updated",
          result: data
        });
      }

      const item_total = updateQuantity.item_price * updateQuantity.item_qty;
      const item_disc = (item_total / 100) * updateQuantity.item_discount;
      updateQuantity.item_subtotal = item_total - item_disc;
      
      const data = await AddToCart.findByIdAndUpdate(
        {_id : id},
        updateQuantity,
        {new : true}
      );

      return res.status(200).json({
        success: true,
        message: "Cart Quantity Updated",
        result: data
      });

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Failed to update cart quantity",
        error: error.message
      });
    }
  },

  deleteCartItem: async (req, res) => {
    const { id } = req.params;

    try {

      if(!id){
        res.status(500).json({
          success : true,
          message : "Item not found"
        })
      }

      await AddToCart.findByIdAndDelete(id);

      return res.status(200).json({
        success: true,
        message: "Cart Item deleted",
      });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch cart data for user",
            error: error.message
        });
    }
  },

  // Truncate Table by User IDs
  truncateTable: async (req, res) => {
    const { id } = req.params;
    const userIds = id.split(',');

    try {
      await AddToCart.deleteMany({ user_id: { $in: userIds } });

      return res.status(200).json({
        success: true,
        message: "Add To Carts Table has been truncated"
      });
      
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to truncate Add To Carts Table",
        error: error.message
      });
    }
  }

};

module.exports = AddToCartController;
