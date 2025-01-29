const User = require('../models/reviews.js');
const Products = require('../models/Product.js');
const Reviews = require('../models/reviews.js');


module.exports.addReview = async (req, res) => {
    let review = req.body.review;
    let prodId = req.params.id;
    // console.log(review);

    let product = await Products.findById(prodId);
    let newReview = new Reviews(review);
    newReview.owner = req.user;
    // console.log(newReview.owner);
    product.reviews.push(newReview);
    await newReview.save();
    await product.save();
    req.flash("success", "review added");
    res.redirect(`/product/${prodId}`);
}

module.exports.deleteReview = async (req, res) => {
    let id = req.params.id;
    let prodId = req.params.prodid;
    let review = await Reviews.findById(id).populate("owner");
    // console.log(review);
    if (!review.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner");
    } else {
        await Products.findByIdAndUpdate(prodId, { $pull: { reviews: id } });
        await Reviews.findByIdAndDelete(id);
        req.flash("success", "Review Deleted");
    }
    res.redirect(`/product/${prodId}`);
}