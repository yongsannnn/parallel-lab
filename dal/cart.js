const { CartItem } = require("../models")

const getAllItems = async (userId) => {
    return await CartItem.collection().where({
        "user_id": userId
    }).fetch({
        require: false,
        withRelated: ["posters"]
    })
}

const getCartItemByUserAndPoster = async (userId, posterId) => {
    const cartItem = await CartItem.where({
        "user_id": userId,
        "poster_id": posterId
    }).fetch({
        require: false,
    })
    return cartItem
}

const removeItem = async (userId, posterId) => {
    const item = await getCartItemByUserAndPoster(userId, posterId);
    if (item) {
        item.destroy();
        return true;
    }
    return false;
}

const updateQuantity = async (userId, posterId, newQuantity) => {
    const item = await getCartItemByUserAndPoster(userId, posterId);
    if (item) {
        item.set("quantity", newQuantity);
        item.save();
        return item;
    } else {
        return null;
    }
}

module.exports = {
    getCartItemByUserAndPoster, getAllItems, removeItem, updateQuantity
}