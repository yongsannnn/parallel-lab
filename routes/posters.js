// Load in Router to setup the routes
const express = require("express")
const router = express.Router()

// Import Poster Model
const {Poster} = require("../models")

// Import forms
const {createPosterForm, bootstrapField}=require("../forms")


router.get("/", async(req,res)=>{
    let posters = await Poster.collection().fetch();
    res.render("posters/index",{
        "posters": posters.toJSON()
    })
})

router.get("/create", (req,res)=>{
    const posterForm = createPosterForm();
    res.render("posters/create",{
        "form": posterForm.toHTML(bootstrapField)
    })
})

router.post("/create", (req,res)=>{
    const posterForm = createPosterForm();
    posterForm.handle(req,{
        "success": async(form)=>{
            const newPoster = new Poster();
            newPoster.set("title", form.data.title)
            newPoster.set("cost", form.data.cost)
            newPoster.set("description", form.data.description)
            newPoster.set("date", form.data.date)
            newPoster.set("stock", form.data.stock)
            newPoster.set("height", form.data.height)
            newPoster.set("width", form.data.width)
            await newPoster.save();
            res.redirect("/posters")
        },
        "error":(form)=>{
            res.render("posters/create",{
                "form": form.toHTML(bootstrapField)
            })
        }
    })
})


module.exports = router