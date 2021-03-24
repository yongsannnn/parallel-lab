const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();
const session = require("express-session")
const flash = require("connect-flash")

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
    "secret": "nil",
    "resave": false,
    "saveUninitialized": true
}))

// setup flash
app.use(flash())


// Setup middleware
app.use(function(req,res,next){
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    next()
})


//importing the routes
const homeRoutes = require("./routes/home")
const posterRoutes = require("./routes/posters")
async function main() {
  app.use("/",homeRoutes)
  app.use("/posters",posterRoutes)
}

main();

app.listen(3000, () => {
  console.log("Server has started");
});