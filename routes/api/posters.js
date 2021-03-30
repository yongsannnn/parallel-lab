const express = require("express")
const router = express.Router();
const posterDataLayer = require("../../dal/posters")


router.get("/", async (req, res) => {
    const allPosters = await posterDataLayer.getAllPosters()
    res.send(allPosters)
})

module.exports = router