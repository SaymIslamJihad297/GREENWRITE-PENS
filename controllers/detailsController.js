const User = require('../models/User');
const Products = require('../models/Product');
const { default: mongoose } = require('mongoose');


module.exports.renderProductDetails = async (req, res) => {
    let id = req.params.id;
    let product = await Products.findById(id).populate({ path: "reviews", populate: "owner" });
    // console.log(product);
    res.render('./details/productDetails.ejs', { product });
}

module.exports.addItemToCart = async (req, res) => {
    let productId = req.params.id;
    let quantity = req.body.quantity;
    if (!req.user) {
        if (!req.session.cart) {
            req.session.cart = []; // initializing the cart if doesn't exist
        }
        req.session.cart.push({ productId, quantity })
        console.log(req.session.cart);
    } else {
        let userId = req.user.id;
        let user = await User.findById(userId);
        user.cart.push({ productId, quantity });
        await user.save();
    }
    req.flash("success", "Added to the cart");
    res.redirect(`/product/${productId}`);

}


module.exports.renderCart = async (req, res) => {
    if (!req.user) {
        let cartItems = req.session.cart;
        if (cartItems && cartItems.length > 0) {
            let items = await Promise.all(cartItems.map(async (product) => {
                let findProduct = await Products.findById(product.productId);
                // console.log(findProduct);
                return {
                    _id: findProduct._id,
                    image: findProduct.image,
                    title: findProduct.title,
                    price: findProduct.price,
                    quantity: parseInt(product.quantity),
                }
            }))
            console.log(items);
            res.render('./cart/cart.ejs', { items });
        }
        else {
            res.render('./cart/nocart.ejs');
        }
    } else {
        let userId = req.user._id;
        let user = await User.findById(userId);
        if (user.cart && user.cart.length > 0) {
            let items = await Promise.all(user.cart.map(async (item) => {
                let product = await Products.findById(item.productId);
                return {
                    _id: item._id,
                    image: product.image,
                    title: product.title,
                    price: product.price,
                    quantity: item.quantity,
                }
            }))
            console.log(items);
            res.render('./cart/cart.ejs', { items });
        } else {
            res.render('./cart/nocart.ejs');
        }
    }
}

module.exports.removeFromCart = async (req, res) => {
    let id = req.params.id;
    if (!req.user) {
        let products = req.session.cart;
        products = products.filter((product) => product.productId !== id);
        req.session.cart = products;
    } else {
        let userId = req.user._id;
        await User.findByIdAndUpdate(userId, { $pull: { cart: { _id: id } } });
    }

    req.flash("success", "Item Removed");
    res.redirect('/cart');
}