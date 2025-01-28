const User = require('../models/User');
const Products = require('../models/Product');

module.exports.renderHomePage = async (req, res) => {
    let products = await Products.find();
    res.render("./home/homeMain.ejs", { products });
}


module.exports.renderRegisterPage = (req, res) => {
    res.render('./user/userRegister.ejs');
}
module.exports.registerUser = async (req, res, next) => {
    let user = req.body.user;
    let password = req.body.password;
    console.log(user, password);
    let newUser = await User.register(user, password);
    req.login(newUser, async (err) => {
        if (err) {
            return next(err);
        } else {
            if (req.tempCart && req.tempCart.length > 0) {
                req.tempCart.forEach((item) => {
                    newUser.cart.push(item);
                })
                await newUser.save();
                delete req.tempCart;
            }
            req.flash("success", "Logged in");
            res.redirect('/');
        }
    })
}

module.exports.renderLoginPage = (req, res) => {
    res.render('./user/userLogin.ejs');
}

module.exports.loginUser = async (req, res, next) => {
    let id = req.user._id;
    console.log(id);
    let currentUser = await User.findById(id);
    if (req.tempCart && req.tempCart.length > 0) {
        req.tempCart.forEach(item => {
            currentUser.cart.push(item);
        });
        await currentUser.save();
        delete req.tempCart;
    }
    req.flash("success", "Logged in");
    res.redirect('/');
}

module.exports.logOutUser = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You are already logged out");
        res.redirect('/');
    } else {
        req.logout((err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Logged Out");
            res.redirect('/');
        })
    }
}

module.exports.renderProfile = (req, res) => {
    res.render('./user/profile.ejs');
}