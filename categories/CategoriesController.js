const express = require("express");
const router = express.Router();
const Category = require("./Category");
const Slugify = require("slugify");

router.get('/admin/categories/new', (req, res) => {
    res.render("admin/categories/new");
})

router.get('/categories/save', (req, res) => {
    let title = req.body.title;
    if(title != undefined){
        Category.create({
            title: title,
            slug: Slugify(title)
        })
    }else
        res.redirect("admin/categories/new");
    
})

module.exports = router;