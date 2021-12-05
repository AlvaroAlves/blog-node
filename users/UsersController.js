const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs")

router.get("/admin/users", (req,res) => {

});

router.get("/admin/users/create", (req, res) =>{
    res.render("admin/users/create");
});

router.post("/users/create", (req, res) =>{
    let { email, password } = req.body;

    User.findOne({
        where: {
            email: email
        }
    }).then((usuario) => {
        if(usuario != undefined){
            res.render("admin/users/create", {err : "Email já consta na base de dados"});
        }else{
            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(password,salt);
            
            User.create({
                email: email,
                password: hash
            }).then(() => {
                res.redirect("/");
            }).catch((err) => {
                res.redirect("/", err);
            })
        }
    }).catch(err =>{
        res.redirect("/", err);
    })

    
});
module.exports = router;