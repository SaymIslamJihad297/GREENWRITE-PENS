const express = require('express');
const { renderHomePage, renderRegisterPage, registerUser, renderLoginPage, loginUser, logOutUser, renderProfile } = require('../controllers/userController');
const passport = require('passport');
const { isLoggedIn, goProfile, preserveCart } = require('../middleware');
const { renderProductDetails, addItemToCart, renderCart, removeFromCart } = require('../controllers/detailsController');
const router = express.Router();


router.get('/', renderHomePage);

// register user
router.route('/register')
    .get(isLoggedIn, renderRegisterPage)
    .post(isLoggedIn, preserveCart, registerUser);

// login user
router.route('/login')
    .get(isLoggedIn, renderLoginPage)
    .post(isLoggedIn, preserveCart, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), loginUser);


router.get('/logout', logOutUser);
router.get('/profile', goProfile, renderProfile);


router.get('/product/:id', renderProductDetails);
router.post('/addtocart/:id', addItemToCart);
router.get('/cart', renderCart);
router.get('/removefromcart/:id', removeFromCart);
module.exports = router;