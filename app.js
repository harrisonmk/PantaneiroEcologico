
//carregando modulos
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require("body-parser");
const app = express();
const admin = require("./routes/admin");
const path = require("path");
const mongoose = require('mongoose');
const session = require("express-session");
const flash = require("connect-flash");
require("./modelo/Postagem");
const Postagem = mongoose.model("postagens");
require("./modelo/Categoria");
const Categoria = mongoose.model("categorias");
require("./modelo/PontoColeta");
const PontoColeta = mongoose.model("pontocoleta");

const fileUpload = require("express-fileupload");
require("./modelo/Noticias");
const Noticias = mongoose.model("noticias");


//configuracoes

//sessao
app.use(session({

   secret: "sustentabilidade",
   resave: true,
   saveUninitialized: true

}));
app.use(flash());

//middleware
app.use((req, res, next) => {

   res.locals.success_msg = req.flash("success_msg");
   res.locals.error_msg = req.flash("error_msg");
   next();


});

//body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Handlebars
app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//mongoose
//'mongodb+srv://Javeiro:Javeiro1996@cluster0-gdgsj.mongodb.net/pantaneiroecologico?retryWrites=true&w=majority',{useNewUrlParser:true}
//"mongodb://localhost/pantaneiroecologico"
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/pantaneiroecologico").then(() => {

   console.log("conectado ao mongo");

}).catch((err) => {

   console.log("erro ao se conectar" + err);

});


//public
app.use(express.static(path.join(__dirname, "public")));

app.use(express.static(__dirname + '/public'));


//rotas
app.get('/', (req, res) => {

   Postagem.find().populate("categoria").sort({ data: "desc" }).then((postagens) => {


      res.render("index", { postagens: postagens });
   }).catch((err) => {

      req.flash("error_msg", "Houve um erro interno");
      res.redirect("/404");

   });


});

app.get("/postagem/:slug", (req, res) => {

   Postagem.findOne({ slug: req.params.slug }).then((postagem) => {
      if (postagem) {
         res.render("postagem/index", { postagem: postagem })

      } else {

         req.flash("error_msg", "Esta postagem nao existe");
         res.redirect("/");

      }


   }).catch((err) => {

      req.flash("error_msg", "Houve um erro interno");
      res.redirect("/");

   });

});


app.get("/categorias", (req, res) => {

   Categoria.find().then((categorias) => {

      res.render("categorias/index", { categorias: categorias });


   }).catch((err) => {

      req.flash("error_msg", "Houve um erro interno ao listar as categorias");
      res.redirect("/");


   });



});


app.get("/categorias/:slug", (req, res) => {

   Categoria.findOne({ slug: req.params.slug }).then((categoria) => {

      if (categoria) {

         Postagem.find({ categoria: categoria._id }).then((postagens) => {

            res.render("categorias/postagens", { postagens: postagens, categoria: categoria })

         }).catch((err) => {

            req.flash("error_msg", "Houve um erro ao listar os posts");
            res.redirect("/");

         });


      } else {

         req.flash("error_msg", "Esta categoria nao existe");
         res.redirect("/");

      }

   }).catch((err) => {

      req.flash("error_msg", "Houve um erro interno ao carregar a pagina desta categoria");
      res.redirect("/");

   });


});


app.get("/pontocoletas",(req,res)=>{

   //lista as categorias
  PontoColeta.find().sort({ date: 'desc' }).then((pontocoleta) => {
   res.render("pontocoleta/index", { pontocoleta: pontocoleta });

 }).catch((err) => {

   req.flash("error_msg", "Houve um erro ao listar as categorias");
   res.redirect("/");

 });


});


app.get("/404", (req, res) => {

   res.send("erro 404!");

});







app.use('/admin', admin);


//outros
const porta = 8089;

//em formato de arrow function
app.listen(porta, () => {

   console.log("servidor rodando!");

});