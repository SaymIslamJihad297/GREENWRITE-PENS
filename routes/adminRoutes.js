const express = require('express');
const passport = require('passport');
const { isAdminUser } = require('../middleware');
const { renderAdminPannel, renderAdminRegister, adminRegister, renderAllUsers, renderManageProducts, renderAddProduct, addProduct, deleteUser, renderEditUser, editUser } = require('../controllers/adminController');
const { renderEditProduct, editProduct, deleteProduct } = require('../controllers/productController');
const router = express.Router();



router.get('/dashboard', isAdminUser, renderAdminPannel);

// register user
router.route('/register')
    .get(renderAdminRegister)
    .post(adminRegister);

// render all users
router.get('/allusers', isAdminUser, renderAllUsers);

// manage products
router.get('/manageproducts', isAdminUser, renderManageProducts);

// add products
router.route('/addnewproduct')
    .get(isAdminUser, renderAddProduct)
    .post(isAdminUser, addProduct);

router.route('/user/:id')
    .delete(isAdminUser, deleteUser)
    .get(isAdminUser, renderEditUser)
    .put(isAdminUser, editUser);



router.get('/product/:prodid', isAdminUser, renderEditProduct);
router.put('/product/:prodid', isAdminUser, editProduct);
router.delete('/product/:prodid', isAdminUser, deleteProduct);
module.exports = router;