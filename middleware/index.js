const jwt = require("jsonwebtoken")

const checkIfAuthenticatedJWT = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (authHeader) {
        const token = authHeader.split(" ")[1]
        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            if (err) {
                res.sendStatus(403)
            }
            req.user = user;
            next();
        })
    } else {
        res.status(401)
        res.send({
            "Message": "Login Required"
        })
    }
}

const checkIfAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        req.flash("error_messages", "Please login first")
        res.redirect("/users/login")
    }
}

module.exports = {
    checkIfAuthenticated, checkIfAuthenticatedJWT
}