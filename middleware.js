module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        req.flash("error", "You are already logged in");
        res.redirect('/');
    }
}

module.exports.isAdminUser = (req, res, next) => {
    if (req.isAuthenticated() && res.locals.currUser.isAdmin) {
        next();
    } else {
        req.flash("error", "Not an admin");
        res.redirect('/');
    }
}

module.exports.goProfile = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You need to login first");
        res.redirect('/login');
    } else {
        next();
    }
}


module.exports.preserveCart = (req, res, next) => {
    req.tempCart = req.session.cart;
    next();
}