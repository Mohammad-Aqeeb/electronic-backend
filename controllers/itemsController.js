const Item = require('../model/Item'); // Import your Mongoose model

const itemsController = {

  // Post New Item
  postData: async (req, res) => {
    try {
        const {item_name, item_category, item_price, item_discount, item_image, item_dsc, item_qty} = req.body;
      
        const item = await Item.create({ item_name, item_category, item_price, item_discount, item_image, item_dsc, item_qty});

        return res.status(201).json({
            message: "Item Has Been Posted",
            data: item
        });

    } catch (error) {
        return res.status(500).json({
            success : true,
            message: "Failed to post item",
            error: error.message
        });
    }
  },

  // Get All Items
  getData: async (req, res) => {
    try {

      const items = await Item.find({});
      
      return res.status(200).json({
        success : true,
        data: items,
        message: "fetched items successfuly"
      });

    } catch (error) {
      
        return res.status(500).json({
            message: "Failed to fetch items",
            error: error.message
        });
    }
  },

  // Get Single Item by ID
  editProduct: async (req, res) => {
    try {
      const item = await Item.findById(req.params.id);

      return res.status(200).json({
        success : true,
        message: "fetched item successfuly",
        data: item
      });

    } catch (error) {
      return res.status(500).json({
        success : false,
        message: "Failed to fetch item",
        error: error.message
      });
    }
  },

  // Update Item
  updateProducts: async (req, res) => {
    try {
        const id = req.params.id;
        const {item_name, item_category, item_price, item_discount, item_dsc, item_image, item_qty} = req.body;
        const item = await Item.findById(id);

        item.item_name = item_name;
        item.item_category = item_category;
        item.item_price = item_price;
        item.item_discount = item_discount;
        item.item_dsc = item_dsc;
        item.item_image = item_image;
        item.item_qty = item_qty;

        const updatedItem = await Item.findByIdAndUpdate({_id : id}, item, {new : true});

        return res.status(200).json({
            success :true,
            data: updatedItem,
            message: "Updated Successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success : false,
            message: "Failed to update item",
            error: error.message
        });
    }
  },

  // Delete Item
  deleteProduct: async (req, res) => {
    try {
        const deleted = await Item.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                success : false,
                message: "Item not found"
            });
        }

        return res.status(200).json({
            success : true,
            message: "Item Has Been Deleted" 
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to delete item",
            error: error.message
        });
    }
  }

};

module.exports = itemsController;
