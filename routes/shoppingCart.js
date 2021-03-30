const express = require("express")
const router = express.Router();

const CartServices = require("../services/cart_services")

router.get("/", async(req,res)=>{
    let cartServices = new CartServices(req.session.user.id)
    const allItems = await cartServices.getAll();
    res.render("shoppingCart/index",{
        "allItems": allItems.toJSON()
    })
    console.log(allItems.toJSON())
})

router.get("/:poster_id/add", async (req,res)=>{
    let cart = new CartServices(req.session.user.id)
    await cart.addToCart(req.params.poster_id)
    req.flash("success_msg", "The poster has been added to your shopping cart")
    res.redirect("back")
})

router.post("/:poster_id/quantity/update", async(req,res)=>{
    let cart = new CartServices(req.session.user.id)
    await cart.updateQuantity(req.params.poster_id, req.body.quantity)
    req.flash("success_msg", "Quantity has been updated")
    res.redirect("back")
})
module.exports = router