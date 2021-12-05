const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");
const adminAuth = require("../middlewares/adminAuth")

router.get("/admin/users/create", adminAuth, (req, res) =>{
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
                res.redirect("/login");
            }).catch((err) => {
                res.redirect("/", err);
            })
        }
    }).catch(err =>{
        res.redirect("/", err);
    })
});

router.get("/login", (req,res) => {
    res.render('admin/users/login');
})

router.post("/authenticate", (req, res) =>{
    let {email, password} = req.body;

    User.findOne({where: {
        email: email
    }}).then(user => {
        if (user != undefined){
            if (bcrypt.compareSync(password, user.password)){
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect("/");
            }else{
                res.render("admin/users/login", {'err' : 'Usuário ou senha incorretos'})
            }
        }else{
            res.render("admin/users/login", {'err' : 'Usuário ou senha incorretos'})
        }
    })
})

router.get("/logout", (req,res) => {
    req.session.user = undefined;
    res.redirect("/")
})

module.exports = router;