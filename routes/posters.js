// Load in Router to setup the routes
const express = require("express")
const router = express.Router()

// Import Poster Model
const { Poster } = require("../models")

// Import forms
const { createPosterForm, bootstrapField } = require("../forms")

// READ
router.get("/", async (req, res) => {
    let posters = await Poster.collection().fetch();
    res.render("posters/index", {
        "posters": posters.toJSON()
    })
})


// CREATE
// GET
router.get("/create", (req, res) => {
    const posterForm = createPosterForm();
    res.render("posters/create", {
        "form": posterForm.toHTML(bootstrapField)
    })
})

// POST
router.post("/create", (req, res) => {
    const posterForm = createPosterForm();
    posterForm.handle(req, {
        "success": async (form) => {
            const newPoster = new Poster();
            newPoster.set("title", form.data.title)
            newPoster.set("cost", form.data.cost)
            newPoster.set("description", form.data.description)
            newPoster.set("date", form.data.date)
            newPoster.set("stock", form.data.stock)
            newPoster.set("height", form.data.height)
            newPoster.set("width", form.data.width)
            await newPoster.save();

            req.flash("success_msg", "New poster has been added")
            res.redirect("/posters")
        },
        "error": (form) => {
            // req.flash("error_msg","Poster cannot be added. Resolve all error and retry.")
            res.render("posters/create", {
                "form": form.toHTML(bootstrapField)
            })
        }
    })
})

// UPDATE
router.get("/:poster_id/update", async (req, res) => {
    // Get the poster that you want to update
    const posterToUpdate = await Poster.where({
        "id": req.params.poster_id
    }).fetch({
        required: true
    })

    const posterJSON = posterToUpdate.toJSON()
    // send the poster to the view
    const form = createPosterForm();
    form.fields.title.value = posterToUpdate.get("title");
    form.fields.cost.value = posterToUpdate.get("cost");
    form.fields.description.value = posterToUpdate.get("description");
    form.fields.date.value = posterToUpdate.get("date");
    form.fields.stock.value = posterToUpdate.get("stock");
    form.fields.height.value = posterToUpdate.get("height");
    form.fields.width.value = posterToUpdate.get("width");

    res.render("posters/update", {
        "form": form.toHTML(bootstrapField),
        "poster": posterJSON
    })
})

router.post("/:poster_id/update", async (req, res) => {
    // Get the poster that you want to update
    const posterToUpdate = await Poster.where({
        "id": req.params.poster_id
    }).fetch({
        required: true
    })

    const posterJSON = posterToUpdate.toJSON()
    const posterForm = createPosterForm();

    posterForm.handle(req, {
        "success": async (form) => {
            posterToUpdate.set(form.data)
            posterToUpdate.save()
            req.flash("success_msg", "Poster has been updated")
            res.redirect("/posters")
        },
        "error": async (form) => {
            res.render("posters/update", {
                "form": form.toHTML(bootstrapField)
            })
        }
    })
})


// DELETE
router.get("/:poster_id/delete", async (req, res) => {
    const posterToDelete = await Poster.where({
        "id": req.params.poster_id
    }).fetch({
        required: true
    })

    res.render("posters/delete", {
        "poster": posterToDelete.toJSON()
    })
})

router.post("/:poster_id/delete", async (req, res) => {
    const posterToDelete = await Poster.where({
        "id": req.params.poster_id
    }).fetch({
        required: true
    })
    await posterToDelete.destroy();
    req.flash("success_msg", "Poster has been deleted")
    res.redirect("/posters")
})



module.exports = router