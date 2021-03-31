const express = require("express")
const router = express.Router()
const crypto = require("crypto")
const { User } = require("../../models")
const jwt = require("jsonwebtoken")
const { checkIfAuthenticatedJWT } = require("../../middleware")

const generateAccessToken = (user) => {
    return jwt.sign({
        "username": user.get("username"),
        "id": user.get("id"),
        "email": user.get("email")
    }, process.env.TOKEN_SECRET, {
        expiresIn: "1h"
    })
}

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash("sha256")
    const hash = sha256.update(password).digest("base64")
    return hash
}

router.post("/login", async (req, res) => {
    let user = await User.where({
        "email": req.body.email
    }).fetch({
        require: false
    })
    if (user && user.get("password") == getHashedPassword(req.body.password)) {
        let accessToken = generateAccessToken(user);
        res.send({ accessToken })
    } else {
        res.send({
            "Message": "Wrong email or password"
        })
    }
})

router.get("/profile", checkIfAuthenticatedJWT, async (req, res) => {
    let user = req.user
    res.send(user)
})


module.exports = router