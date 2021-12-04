const express = require("express");
const router = express.Router();
const Category = require('../categories/Category')
const Article = require('./Article')
const slugify = require('slugify')

router.get('/admin/articles', (req, res) => {
    res.send("teste")
})

router.get('/admin/articles/new', (req, res) => {
    Category.findAll().then(categories => {
        res.render('admin/articles/new', {categories: categories});
    }) 
})

router.post('/articles/save', (req,res) => {
    let { category, body, title } = req.body;
    Article.create({
        title: title,
        body: body,
        slug: slugify(title),
        categoryId: category
    }).then(() => {
        res.redirect("/admin/articles");
    })
})

module.exports = router;