const express = require("express")


// Create a new express router
const router = express.Router();

router.get("/", (req,res)=>{
    res.render("home/landing")
})

router.get("/about", (req,res)=>{
    res.render("home/about-us")
})

router.get("/contact", (req,res)=>{
    res.render("home/contact")
})






module.exports = router;