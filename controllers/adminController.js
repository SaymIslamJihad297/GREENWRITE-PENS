const User = require('../models/User');
const Products = require('../models/Product');
const asyncWrap = require('../utils/asyncWrap');
const Reviews = require('../models/reviews');
const adminPss = process.env.ADMIN_PASSWORD;

module.exports.renderAdminPannel = asyncWrap(async (req, res) => {
    let allAdmins = await User.find({ isAdmin: true });
    res.render('./admin/dashboard.ejs', { allAdmins });
})
module.exports.renderAdminRegister = (req, res) => {
    res.render('./admin/userRegister.ejs');
}
module.exports.adminRegister = asyncWrap(async (req, res, next) => {
    let user = req.body.user;
    let password = req.body.password;
    let adminPassword = req.body.adminpassword;
    console.log(user, password, adminPassword);
    if (adminPassword === adminPss) {
        let newAdmin = await User.register(user, password);
        newAdmin.isAdmin = true;
        await newAdmin.save();
        console.log(newAdmin);
        req.login(newAdmin, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome admin");
            res.redirect('/');
        })
    } else {
        req.flash("error", "Wrong admin password!");
        res.redirect("/admin/register");
    }
})


module.exports.renderAllUsers = asyncWrap(async (req, res) => {
    let allUsers = await User.find({ isAdmin: false });
    res.render('./admin/allUsers.ejs', { allUsers });
})

module.exports.renderManageProducts = asyncWrap(async (req, res) => {
    let products = await Products.find();
    res.render('./admin/Products.ejs', { products });
})
module.exports.renderAddProduct = (req, res) => {
    res.render('./admin/AddProduct.ejs');
}
module.exports.addProduct = asyncWrap(async (req, res) => {
    let product = req.body.product;
    let newProduct = new Products(product);
    newProduct.save();
    req.flash("success", "Product Added");
    res.redirect('/admin/manageproducts');
})


module.exports.deleteUser = asyncWrap(async (req, res) => {
    let id = req.params.id;
    await Reviews.deleteMany({ owner: id });
    await User.findByIdAndDelete(id);
    req.flash("success", "User deleted");
    res.redirect('/admin/allusers');
})

module.exports.renderEditUser = asyncWrap(async (req, res) => {
    let userId = req.params.id;
    let user = await User.findById(userId);
    res.render('./admin/edituser.ejs', { user });
})

module.exports.editUser = asyncWrap(async (req, res) => {
    let userId = req.params.id;
    let newData = req.body.user;
    // console.log(newData);
    let result = await User.findByIdAndUpdate(userId, newData);
    req.flash("success", "User Updated");
    res.redirect('/admin/allusers');
})