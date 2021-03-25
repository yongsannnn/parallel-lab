const express = require("express")
const router = express.Router();
const crypto = require("crypto")
const { User } = require("../models")


const { createUserForm, bootstrapField, createLoginForm } = require("../forms")

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
    const loginForm = createLoginForm()
    res.render("users/login",{
        "form": loginForm.toHTML(bootstrapField)
    })
})

router.post("/login", (req,res)=>{
    const loginForm = createLoginForm()
    loginForm.handle(req,{
        "success": async(form)=>{

            // Finding user based on email address
            let user = await User.where({
                "email": form.data.email
            }).fetch({
                require: false //If the user don't exist, continue with code
            })

            // If user exist, check password
            if (user){
                if(user.get("password") == getHashedPassword(form.data.password)){
                    // Saving data into session
                    req.session.user = {
                        id: user.get("id"),
                        username: user.get("username"),
                        email: user.get("email")
                    }
                    req.flash("success_msg", `Hi ${req.session.user.username}.`)
                    res.redirect("/posters")
                } else {
                    req.flash("error_msg", "Login failed, check credentials.")
                    res.redirect("/users/login")
                }
            } else {
                req.flash("error_msg", "Login failed, check credentials.")
                res.redirect("/users/login")
            }
        },
        "error": (form)=>{
            res.render("users/login", {
                "form": form.toHTML(bootstrapField)
            })
        }
    })
})


router.get("/logout", (req, res) => {
    req.session.user = null
    req.flash("success_msg", "Successfully logout")
    res.redirect("/users/login")
})


module.exports = router;