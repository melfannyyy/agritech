const express = require('express');
const router = express.Router();

// Import controllers
const adminController = require('../controllers/adminController');
const userController = require('../controllers/userController');
const productController = require('../controllers/productController');
const cropController = require('../controllers/cropController');
const farmController = require('../controllers/farmController');
const bookingController = require('../controllers/bookingController');

// Admin routes
router.post('/alogin', adminController.adminLogin);
router.post('/asignup', adminController.adminSignup);

// User routes
router.post('/ulogin', userController.userLogin);
router.post('/usignup', userController.userSignup);
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.put('/useredit/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);
router.delete('/userdelete/:id', userController.deleteUser);

// Product routes
router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);
router.post('/products', productController.createProduct);
router.put('/products/:id', productController.updateProduct);
router.delete('/deleteproduct/:id', productController.deleteProduct);

// Crop routes
router.get('/cropsdata', cropController.getCropsData);
router.get('/cropsdata/:name', cropController.getCropByName);
router.get('/getcrop/:id', cropController.getCropById);
router.get('/getcrops/:userId', cropController.getCropsByUserId);
router.post('/addcrop', cropController.addCrop);
router.put('/editcrop/:id', cropController.updateCrop);
router.delete('/deletecrop/:id', cropController.deleteCrop);

// Farm routes
router.post('/addfarm', farmController.addFarm);
router.get('/getfarm/:id', farmController.getFarmById);
router.get('/farms', farmController.getAllFarms);
router.get('/getfarms/:userId', farmController.getFarmsByUserId);
router.put('/editfarm/:id', farmController.updateFarm);
router.delete('/deletefarm/:id', farmController.deleteFarm);

// Booking routes
router.post('/bookings', bookingController.orderProduct);
router.post('/orderproduct', bookingController.orderProduct);
router.get('/getbookings/:userId', bookingController.getBookingsByUserId);
router.get('/bookings', bookingController.getAllBookings);
router.delete('/bookings/:id', bookingController.deleteBooking);

// Crops alias (for dashboard)
router.get('/crops', cropController.getAllCrops);

module.exports = router;
