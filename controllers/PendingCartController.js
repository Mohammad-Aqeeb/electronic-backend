const PendingCart = require('../model/PendingCart');

const PendingCartController = {

  // Add item to pending cart
  addPendingCarts: async (req, res) => {
    try {
      const {
        item_name,
        item_category,
        item_price,
        item_dsc,
        item_qty,
        item_image,
        item_discount
      } = req.body;

      const item_total = item_price * item_qty;
      const item_disc = (item_total / 100) * item_discount;
      const item_subtotal = item_total - item_disc;

      const newItem = await PendingCart.create({
        item_id: id,
        item_name,
        item_category,
        item_price,
        item_dsc,
        item_qty,
        item_image,
        item_discount,
        item_subtotal
      });

      res.status(201).json({
        success: true,
        message: "Data added to pending carts",
        data: newItem });

    } 
    catch (error) {
      res.status(500).json({
        success: false,
        message: "Error adding to pending carts",
        error: error.message
    });
    }
  },

  // Get all pending cart items
  getLocalcartData: async (req, res) => {
    try {
      const pendingCart = await PendingCart.find({});
      const grandTotal = pendingCart.reduce((total, item) => total + item.item_subtotal, 0);

      res.status(200).json({
        success : false,
        message: "Local Data View", 
        data: pendingCart,
        grandTotal
    });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching cart data",
        error: error.message
    });
    }
  },

  // Increase quantity
  updateLocalQuantityPlus: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await PendingCart.findById({_id: id});
      
      if (!item) return res.status(404).json({
        success: false,
        message: "Item not found"
      });

      item.item_qty += 1;

      const item_total = item.item_price * item.item_qty;
      const item_disc = (item_total / 100) * item.item_discount;
      item.item_subtotal = item_total - item_disc;

      const data = await PendingCart.findByIdAndUpdate({_id : id}, item , {new : true});

      res.json({
        success : true,
        result: data,
        message: "Cart quantity increased",
      });
      
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating quantity",
        error: error.message 
      });
    }
  },

  // Decrease quantity
  updateLocalQuantityMinus: async (req, res) => {
    try {
      const { id } = req.params;
      let item = await PendingCart.findById(id);
      if (!item) return res.status(404).json({ success: false, message: "Item not found" });

      item.item_qty -= 1;

      if (item.item_qty <= 0) {
        await PendingCart.findByIdAndDelete(id);
        return res.json({ message: "Item removed from cart (quantity zero)" });
      }

      const item_total = item.item_price * item.item_qty;
      const item_disc = (item_total / 100) * item.item_discount;
      item.item_subtotal = item_total - item_disc;

      await item.save();
      res.json({ message: "Cart quantity decreased", result: item });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error decreasing quantity", error: error.message });
    }
  },

  // Delete multiple items by IDs (comma-separated)
  truncateTableById: async (req, res) => {
    try {
      const ids = req.params.id.split(',');
      await PendingCart.deleteMany({ _id: { $in: ids } });
      res.json({ message: "Selected items deleted from pending cart" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error deleting items", error: error.message });
    }
  },

  // Truncate the entire pending cart table
  truncateTable: async (req, res) => {
    try {
      await PendingCart.deleteMany({});
      res.json({ message: "Pending cart cleared successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error clearing cart", error: error.message });
    }
  }

};

module.exports = PendingCartController;
