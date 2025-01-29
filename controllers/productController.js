const Products = require('../models/Product');
const asyncWrap = require('../utils/asyncWrap');


module.exports.renderEditProduct = asyncWrap(async (req, res) => {
    let prodId = req.params.prodid;
    let product = await Products.findById(prodId);
    res.render("./products/editProduct.ejs", { product });
})
module.exports.editProduct = asyncWrap(async (req, res) => {
    let prodId = req.params.prodid;
    let updatedProduct = req.body.product;
    let product = await Products.findByIdAndUpdate(prodId, updatedProduct);
    req.flash("success", "Product Updated");
    res.redirect('/admin/manageproducts');
})

module.exports.deleteProduct = asyncWrap(async (req, res) => {
    let prodId = req.params.prodid;
    await Products.findByIdAndDelete(prodId);
    req.flash("success", "Product Deleted");
    res.redirect('/admin/manageproducts');
})