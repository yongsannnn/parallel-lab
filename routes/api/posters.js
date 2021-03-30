const express = require("express")
const router = express.Router();
const posterDataLayer = require("../../dal/posters")
const { Poster } = require("../../models")
const { createPosterForm } = require("../../forms")


router.get("/", async (req, res) => {
    const allPosters = await posterDataLayer.getAllPosters()
    res.send(allPosters)
})

router.post("/", async (req, res) => {
    const allGenre = await posterDataLayer.getAllGenres()
    const posterForm = createPosterForm(allGenre);
    posterForm.handle(req, {
        "success": async (form) => {
            let { genre, ...posterData } = form.data;
            const poster = new Poster()
            poster.set(posterData)
            await poster.save();
            if (genre) {
                await poster.genres().attach(genre.split(","))
            }
            res.send(poster)
        },
        "error": (form) => {
            let errors = {};
            for (let key in form.fields) {
                if (form.fields[key].error) {
                    errors[key] = form.fields[key].error
                }
            }
            res.send(JSON.stringify(errors))
        }
    })
})

module.exports = router