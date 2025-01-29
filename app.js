if (process.env.NODE_ENV != "proccess") {
    require('dotenv').config();
}
const bodyParser = require("body-parser");
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport')
const localStrategy = require('passport-local');
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const methodOverride = require('method-override');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const ExpressError = require('./utils/ExpressError');

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
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/auth/google/callback",
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if the user already exists in the DB
            let user = await User.findOne({ googleId: profile.id });
            if (!user) {
                let usererName = () => {
                    let i = 0;
                    let UserName = "";
                    while (true) {
                        if (profile.emails[0].value[i] != "@") {
                            UserName += profile.emails[0].value[i];
                            i++;
                        } else {
                            return UserName;
                        }
                    }
                }
                // If the user does not exist, create a new user
                user = new User({
                    name: profile.displayName,
                    // username: profile.emails[0].value,
                    username: usererName(),
                    email: profile.emails[0].value,
                    googleId: profile.id,
                    isAdmin: false,
                });
                await user.save();
            }
            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    })
);
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user); // Retrieve full user object from the database
    } catch (error) {
        done(error, null);
    }
});


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    res.locals.isLoggedIn = req.isAuthenticated();
    next();
})

app.use('/', mainRoutes);
app.use('/admin', adminRoutes);


app.get("/", isAuthenticated, (req, res) => {
    res.send(`Welcome ${req.user.name}`);
});
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/auth/google");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
app.post("/api/chat", async (req, res) => {
    const { message } = req.body;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(message);

        res.json({ reply: result.response.text() });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Failed to generate a response." });
    }
});

app.get("/ai/greenwrite", (req, res) => {
    res.render("./ai/index.ejs");
});



app.all('*', (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
})

app.use((err, req, res, next) => {
    let { status = 500, message = "Some error happend" } = err;
    res.status(status).render('error.ejs', { status, message });
})

async function main() {
    mongoose.connect(dbUrl);
}

app.listen(8080, () => {
    console.log("Server started listening");
})