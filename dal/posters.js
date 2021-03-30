const { Poster, Genres } = require("../models")

const getAllPosters = async() => {
    return await Poster.fetchAll()
}

const getAllGenres = async () => {
    const allGenre = await Genres.fetchAll().map(genre => [genre.get("id"), genre.get("name")])
    return allGenre
}

const getPosterById = async (posterId) => {
    const poster = await Poster.where({
        "id": posterId
    }).fetch({
        require: true,
        withRelated: ["genres"]
    })
    return poster
}

module.exports = {
    getAllGenres, getPosterById, getAllPosters
}