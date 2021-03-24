const bookshelf = require("../bookshelf")

const Poster = bookshelf.model("Poster", {
    tableName: "posters",
    genres(){
        return this.belongsToMany("Genres")
    }
})


const Genres = bookshelf.model("Genres",{
    tableName: "genres",
    posters(){
        return this.belongsToMany("Poster")
    }
})
module.exports = {
    Poster, Genres
}