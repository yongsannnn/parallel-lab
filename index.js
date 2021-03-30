const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();
const session = require("express-session")
const flash = require("connect-flash")
const csurf = require("csurf")

// create an instance of express app
let app = express();

// set the view engine
app.set("view engine", "hbs");

// static folder
app.use(express.static("public"));

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

// enable forms
app.use(
    express.urlencoded({
        extended: false
    })
);

// setup sessions - this should be before your routes
app.use(session({
    "secret": process.env.SESSION_SECRET_KEY,
    "resave": false,
    "saveUninitialized": true
}))

// setup flash
app.use(flash())

// Setup CSURF
// app.use(csurf());
const csurfInstance = csurf();
app.use(function (req, res, next) {
    // console.log(req.url)
    if (req.url === "/checkout/process_payment") {
        return next();
    }
    csurfInstance(req, res, next);
})

app.use(function (err, req, res, next) {
    console.log(err)
    if (err && err.code == "EBADCSRFTOKEN") {
        req.flash("error_messages", "Form has expired.")
        res.redirect("back");
    } else {
        next()
    }
})

// Setup middleware
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    next()
})

//Global middleware to inject the req.session.use object into the local variable, which are accessible by hbs_files
app.use(function (req, res, next) {
    res.locals.user = req.session.user;
    next()
})

app.use(function (req, res, next) {
    if (req.csrfToken) {
        res.locals.csrfToken = req.csrfToken();
    }
    next()
})

//importing the routes
const homeRoutes = require("./routes/home")
const posterRoutes = require("./routes/posters")
const userRoutes = require("./routes/users")
const cloudinaryRoute = require("./routes/cloudinary")
const shoppingCartRoute = require("./routes/shoppingCart")
const checkoutRoute = require("./routes/checkout")

//import api
const api = {
    "posters": require("./routes/api/posters")
}
async function main() {
    app.use("/", homeRoutes)
    app.use("/posters", posterRoutes)
    app.use("/users", userRoutes)
    app.use("/cloudinary", cloudinaryRoute)
    app.use("/cart", shoppingCartRoute)
    app.use("/checkout", checkoutRoute)
    app.use("/api/posters", api.posters)

}

main();

app.listen(3000, () => {
    console.log("Server has started");
});