const express = require("express");
const router = express.Router();
const Category = require('../categories/Category')
const Article = require('./Article')
const slugify = require('slugify')

router.get('/admin/articles', (req, res) => {
    Article.findAll({
        include : [{model:Category}]
    }).then((articles) =>{
        res.render("admin/articles/index", {articles: articles});
    })
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


router.post('/articles/delete', (req, res) => {
    let id = req.body.id;
    if(id != undefined && !isNaN(id)){
        Article.destroy({
            where: {
                id: id
            }
        }).then(() => {
            res.redirect("/admin/articles");
        })
    }else
        res.redirect("/admin/articles");
})

router.get('/admin/articles/edit/:id', (req, res) =>{
    let id = req.params.id;
    Article.findByPk(id).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render("admin/articles/edit", {categories: categories, article:article})
            }) 
        }else
            res.redirect("/")
    }).catch(err => {
        res.redirect("/", {err : err})
    })
})
module.exports = router;