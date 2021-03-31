const bookshelf = require("../bookshelf")

const Poster = bookshelf.model("Poster", {
    tableName: "posters",
    genres() {
        return this.belongsToMany("Genres")
    }
})


const Genres = bookshelf.model("Genres", {
    tableName: "genres",
    posters() {
        return this.belongsToMany("Poster")
    }
})

const User = bookshelf.model("User", {
    tableName: "users"
})

const CartItem = bookshelf.model("CartItem", {
    tableName: "cart_items",
    posters() {
        return this.belongsTo("Poster")
    }
})

const BlacklistedToken = bookshelf.model("BlacklistedToken", {
    tableName: "blacklisted_tokens"
})

module.exports = {
    Poster, Genres, User, CartItem, BlacklistedToken
}