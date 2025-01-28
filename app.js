if (process.env.NODE_ENV != "proccess") {
    require('dotenv').config();
}
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport')
const localStrategy = require('passport-local');
const methodOverride = require('method-override');

const User = require('./models/User');
const mainRoutes = require('./routes/mainRoutes');
const adminRoutes = require('./routes/adminRoutes');

const dbUrl = process.env.ATLASDB_URL;
const secretKey = process.env.SESSION_SECRET_KEY;
main().then(() => {
    console.log("Database connected");
}).catch((err) => {
    console.log(err);
})

const sessionOptions = {
    secret: secretKey,
    resave: false,
    saveUninitialized: true
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(sessionOptions));
app.use(flash());
app.use(express.urlencoded({ extended: true, limit: '50kb' }));
app.use(express.json({ limit: '50kb' }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    res.locals.isLoggedIn = req.isAuthenticated();
    next();
})

app.use('/', mainRoutes);
app.use('/admin', adminRoutes);



app.all('*', (req, res, next) => {
    req.flash("error", "Page not found");
    res.redirect('/');
    next();
})
async function main() {
    mongoose.connect(dbUrl);
}

app.listen(8080, () => {
    console.log("Server started listening");
})