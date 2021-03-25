const express = require("express")
const router = express.Router();
const crypto = require("crypto")
const { User } = require("../models")


const { createUserForm, bootstrapField } = require("../forms")

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash("sha256")
    const hash = sha256.update(password).digest("base64")
    return hash
}

router.get("/register", (req, res) => {
    const registrationForm = createUserForm();

    res.render("users/register", {
        form: registrationForm.toHTML(bootstrapField)
    })
})

router.post("/register", (req,res)=>{
    const registrationForm = createUserForm();
    registrationForm.handle(req,{
        "success": async(form)=>{
            let {confirm_password,...userData} = form.data
            userData.password = getHashedPassword(userData.password);
            const user = new User(userData)
            await user.save();
            req.flash("success_msg", "New user created")
            res.redirect("/users/login")
        },
        "error":(form) =>{
            res.render("users/register",{
                "form": form.toHTML(bootstrapField)
            })
        }
    })
})

router.get("/login", (req,res)=>{
    res.render("users/login")
})
module.exports = router;