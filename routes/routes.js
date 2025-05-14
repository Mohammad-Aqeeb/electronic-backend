const express = require('express');
const router = express.Router();

const itemsController = require('../controllers/itemsController.js');
const AddToCartController = require('../controllers/AddToCartController.js');
const UserController = require('../controllers/UserController.js');
const UsersController = require("../controllers/UsersController.js");
const SellerController = require('../controllers/SellerController.js');
const PendingCartController = require('../controllers/PendingCartController.js');
const MyOrdersController = require('../controllers/MyOrdersControlle.js');
const AddProductController = require('../controllers/AddProductController.js');

const auth = require("../middleware/auth.js");
const sellerOrder = require('../controllers/sellerOrder.js');

// User routes
// router.post('/userSignup', UserController.userRegister);
// router.post('/userLogin', UserController.userLogin);
// router.put('/editUserProfile/:id', UserController.editProfile);
// router.get('/getUserProfile/:id', UserController.getProfile);

// // Seller routes
// router.post('/sellerSignup', SellerController.sellerRegister);
// router.post('/sellerLogin', SellerController.sellerLogin);
// router.put('/editSellerProfile/:id', SellerController.editProfile);
// router.get('/getSellerProfile/:id', SellerController.getProfile);
// router.post('/addProduct', SellerController.addProduct);

//users routes
router.post('/userSignup', UsersController.userRegister);
router.post('/userLogin', UsersController.userLogin);
router.put('/editUserProfile/:id', UsersController.editProfile);
router.get('/getUserProfile', auth,  UsersController.getProfile);


// Item routes
router.post('/itemPost', itemsController.postData);
router.get('/itemGet', itemsController.getData);
router.get('/editProduct/:id', itemsController.editProduct);
router.put('/updateProduct/:id', itemsController.updateProducts);
router.delete('/deleteProduct/:id', itemsController.deleteProduct);




// AddProduct routes
router.post('/addProduct',auth , AddProductController.addProduct);
router.put('/updateProduct/:id', AddProductController.updateProduct);
router.delete('/deleteProductByID/:id', AddProductController.deleteProductByID);

// Cart routes
router.post('/addCart', AddToCartController.addToCart);
router.get('/getCartData', AddToCartController.getCartData);
router.get('/getCartData/:id', AddToCartController.getCartDataByUserId);
router.put('/updateQtyPlus/:id', AddToCartController.updateQuantityPlus);
router.put('/updateQtyMinus/:id', AddToCartController.updateQuantityMinus);
router.get('/addToCartsTruncate/:id', AddToCartController.truncateTable);

// Pending cart routes
router.post('/addPending', PendingCartController.addPendingCarts);
router.get('/truncateTable/:id', PendingCartController.truncateTableById);
router.get('/truncateTable', PendingCartController.truncateTable);
router.get('/getLocalData', PendingCartController.getLocalcartData);
router.put('/updateQtyPlusLocal/:id', PendingCartController.updateLocalQuantityPlus);
router.put('/updateQtyMinusLocal/:id', PendingCartController.updateLocalQuantityMinus);

// Orders routes
router.post('/postMyOrder', MyOrdersController.postMyOrder);
router.get('/getMyOrder/:id', MyOrdersController.getMyOrder);
router.get('/cancelOrder/:id', MyOrdersController.cancelOrder);


router.get('/seller-orders/:sellerId', sellerOrder.getSellerOrder)

module.exports = router;
