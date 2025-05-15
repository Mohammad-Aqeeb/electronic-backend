const cloudinary = require('cloudinary');
const AddProduct = require('../model/AddProduct'); // Your Mongoose model
const fs = require("fs");

const AddProductController = {

  // Add Product
  addProduct: async (req, res) => {
    const seller_id = req.user._id;
    const {item_name, item_category, item_price, item_dsc, item_qty, item_discount } = req.body;
    const file = req.files.item_image;

    console.log(req.files.item_image);
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No image file uploaded"
      });
    }
  
    try {
      const folder = "Home/images";
      const {options} = {folder};
      const response = await cloudinary.uploader.upload(file.tempFilePath, options);

      const newItem = await AddProduct.create({
        seller_id,
        item_name,
        item_category,
        item_price,
        item_dsc,
        item_qty,
        item_image: response.secure_url,
        item_discount
      });
      
      return res.status(201).json({
        success: true,
        data: newItem,
        message: "Product added successfully"
      });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to add product",
        error: error.message
      });
    }
  },

  // Update Product
  updateProduct: async (req, res) => {
    const { id } = req.params;
    const { item_name, item_price, item_dsc, item_discount, item_image } = req.body;

    try {
      const updated = await AddProduct.findByIdAndUpdate(
        {_id : id},
        { item_name, item_price, item_dsc, item_discount, item_image},
        // item_qty: 1 update karte time
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }

      return res.status(200).json({
        success: true,
        data: updated,
        message: "Product updated successfully"
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to update product",
        error: error.message
      });
    }
  },

  // Delete Product by ID
  deleteProductByID: async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await AddProduct.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Product not found" 
            });
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete product",
            error: error.message
        });
    }
  }
};

module.exports = AddProductController;
