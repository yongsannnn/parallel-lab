// Load in Router to setup the routes
const express = require("express")
const router = express.Router()

// Import Poster Model
const { Poster, Genres } = require("../models")

// Import forms
const { createPosterForm, bootstrapField } = require("../forms")

// READ
router.get("/", async (req, res) => {
    let posters = await Poster.collection().fetch({
        withRelated: ["genres"]
    });
    res.render("posters/index", {
        "posters": posters.toJSON()
    })
})


// CREATE
// GET
router.get("/create", async(req, res) => {
    //display all genres
    const allGenre = await Genres.fetchAll().map(genre=>[genre.get("id"),genre.get("name")])

    const posterForm = createPosterForm(allGenre);
    res.render("posters/create", {
        "form": posterForm.toHTML(bootstrapField)
    })
})

// POST
router.post("/create", async (req, res) => {
    const allGenre = await Genres.fetchAll().map(genre=>[genre.get("id"),genre.get("name")])
    
    const posterForm = createPosterForm(allGenre);
    posterForm.handle(req, {
        "success": async (form) => {
            let {genre,...posterData} = form.data;
            const newPoster = new Poster();
            newPoster.set(posterData);
            await newPoster.save();
            if (genre){
                await newPoster.genres().attach(genre.split(","))
            }
            // newPoster.set("title", form.data.title)
            // newPoster.set("cost", form.data.cost)
            // newPoster.set("description", form.data.description)
            // newPoster.set("date", form.data.date)
            // newPoster.set("stock", form.data.stock)
            // newPoster.set("height", form.data.height)
            // newPoster.set("width", form.data.width)
            // await newPoster.save();

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
    const allGenre = await Genres.fetchAll().map(genre=>[genre.get("id"),genre.get("name")])
    
    // Get the poster that you want to update
    const posterToUpdate = await Poster.where({
        "id": req.params.poster_id
    }).fetch({
        require: true,
        withRelated: ["genres"]
    })

    const posterJSON = posterToUpdate.toJSON()
    const selectedGenreIds = posterJSON.genres.map(g => g.id)
    // send the poster to the view
    const form = createPosterForm(allGenre);
    form.fields.title.value = posterToUpdate.get("title");
    form.fields.cost.value = posterToUpdate.get("cost");
    form.fields.description.value = posterToUpdate.get("description");
    form.fields.date.value = posterToUpdate.get("date");
    form.fields.stock.value = posterToUpdate.get("stock");
    form.fields.height.value = posterToUpdate.get("height");
    form.fields.width.value = posterToUpdate.get("width");
    form.fields.genre.value = selectedGenreIds

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
        require: true,
        withRelated:["genres"]
    })

    const posterJSON = posterToUpdate.toJSON()
    const selectedPosterIds = posterJSON.genres.map(g => g.id)
    const posterForm = createPosterForm();

    posterForm.handle(req, {
        "success": async (form) => {
            let {genre, ...posterData} = form.data
            posterToUpdate.set(posterData)
            posterToUpdate.save()
            let newGenreId = genre.split(",")
            posterToUpdate.genres().detach(selectedPosterIds)
            posterToUpdate.genres().attach(newGenreId)
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
        require: true
    })

    res.render("posters/delete", {
        "poster": posterToDelete.toJSON()
    })
})

router.post("/:poster_id/delete", async (req, res) => {
    const posterToDelete = await Poster.where({
        "id": req.params.poster_id
    }).fetch({
        require: true
    })
    await posterToDelete.destroy();
    req.flash("success_msg", "Poster has been deleted")
    res.redirect("/posters")
})



module.exports = router