const express = require('express');
const { renderHomePage, renderRegisterPage, registerUser, renderLoginPage, loginUser, logOutUser, renderProfile, signInWithGoogle, signInWithAccount } = require('../controllers/userController');
const passport = require('passport');
const { isLoggedIn, goProfile, preserveCart, isNotLoggedIn } = require('../middleware');
const { renderProductDetails, addItemToCart, renderCart, removeFromCart } = require('../controllers/detailsController');
const { addReview, deleteReview } = require('../controllers/reviewController');
const router = express.Router();


router.get('/', renderHomePage);
router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}))
router.get('/auth/google/callback', preserveCart, passport.authenticate('google', { failureRedirect: '/login' }), signInWithAccount);

router.get('/auth/github', passport.authenticate('github', {
    scope: ['user:email']
}))
router.get('/auth/github/callback', preserveCart, passport.authenticate('github', { failureRedirect: '/login' }), signInWithAccount);
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


router.post('/review/:id', isNotLoggedIn, addReview);
router.delete('/review/:prodid/:id', isNotLoggedIn, deleteReview);

module.exports = router;