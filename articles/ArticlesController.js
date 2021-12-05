const express = require("express");
const router = express.Router();
const Category = require('../categories/Category')
const Article = require('./Article')
const slugify = require('slugify')
const adminAuth = require('../middlewares/adminAuth')

router.get('/admin/articles', adminAuth, (req, res) => {
    Article.findAll({
        include : [{model:Category}]
    }).then((articles) =>{
        res.render("admin/articles/index", {articles: articles});
    })
})

router.get('/admin/articles/new', adminAuth, (req, res) => {
    Category.findAll().then(categories => {
        res.render('admin/articles/new', {categories: categories});
    }) 
})

router.post('/articles/save', adminAuth, (req,res) => {
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


router.post('/articles/delete',adminAuth, (req, res) => {
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

router.get('/admin/articles/edit/:id', adminAuth, (req, res) =>{
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

router.post('/articles/update', adminAuth, (req,res) => {
    let {id, category, body, title} = req.body;
    Article.update({
        title: title,
        body: body,
        slug: slugify(title),
        categoryId: category},{
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/admin/articles");
    }).catch(err => {
        res.redirect("/");
    })
})

router.get('/articles/page/:page', (req, res) =>{
    let page = req.params.page;
    const limit = 4;
    let offset = 0;

    if (!isNaN(page) && page != 1){
        offset = parseInt(page-1) * limit;
    }

    Article.findAndCountAll({
        limit: limit,
        offset: offset,
        order: [
            ['id', 'DESC']
        ]
    }).then(articles => {
        let next;
        if (offset + limit >= articles.count)
            next = false;
        else
            next = true;

        Category.findAll().then(categories => {
            let result = {
                page: parseInt(page),
                articles: articles,
                next: next
            }
            res.render("admin/articles/page", {result: result, categories: categories})
        })

        
    })
})
module.exports = router;