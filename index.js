const express = require("express");
const app = express();
const bodyParser = require("body-parser")
const connection = require("./database/database")

const categoriesController = require("./categories/CategoriesController")
const articlesController = require("./articles/ArticlesController")

const Article = require("./articles/Article")
const Category = require("./categories/Category")

//view engine
app.set('view engine', 'ejs');

//arquivos staticos
app.use(express.static('public'));

//body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// database
connection
    .authenticate()
    .then(() => {
        console.log("Conexão realizada com sucesso!");
    }).catch((error) => {
        console.log(error);
    })

//Rotas
app.use("/", categoriesController);
app.use("/", articlesController);
app.get("/", (req, res) => {
    res.render("index");
})


app.listen(8080, ()=>{
    console.log("O servidor está rodando!")
})