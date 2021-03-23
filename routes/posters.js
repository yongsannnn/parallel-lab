// Load in Router to setup the routes
const express = require("express")
const router = express.Router()

// Import Poster Model
const {Poster} = require("../models")

// Import forms

router.get("/", async(req,res)=>{
    let posters = await Poster.collection().fetch();
    res.send(posters)
})


module.exports = router