const User = require('../models/reviews.js');
const Products = require('../models/Product.js');
const Reviews = require('../models/reviews.js');


module.exports.addReview = async (req, res) => {
    let review = req.body.review;
    let prodId = req.params.prodid;
    console.log(review);

    // let product = await Products.findById(prodId);
    // let newReview = new Reviews(review);
    // newReview.owner = currUser;
    // product.reviews.push(newReview);
    // await newReview.save();
    // await product.save();
    req.flash("success", "review added");
    res.redirect(`/product/${prodId}`);
}