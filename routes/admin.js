const express = require("express");
const rota = express.Router();
const mongoose = require("mongoose");
require("../modelo/Categoria");
const Categoria = mongoose.model("categorias");
require('../modelo/Postagem');
const Postagem = mongoose.model("postagens");
require("../modelo/PontoColeta");
const PontoColeta = mongoose.model("pontocoleta");
require("../modelo/Noticias");
const Noticias = mongoose.model("noticias");
require("../modelo/Produto");
const Produto = mongoose.model("produto");

rota.get('/', (req, res) => {

  res.render("admin/index");


});

rota.get('/posts', (req, res) => {

  res.send("pagina de posts");


});


rota.get("/categorias", (req, res) => {


  //lista as categorias
  Categoria.find().sort({ date: 'desc' }).then((categorias) => {
    res.render("admin/categorias", { categorias: categorias });

  }).catch((err) => {

    req.flash("error_msg", "Houve um erro ao listar as categorias");
    res.redirect("/admin");

  });


});

rota.get('/categorias/add', (req, res) => {


  res.render("admin/addcategorias");



});

rota.post("/categorias/nova", (req, res) => {

  var erros = []

  if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
    erros.push({ texto: "Nome Invalido" });
  }

  if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {

    erros.push({ texto: "Slug Invalido" });
  }

  if (req.body.nome.length < 2) {
    erros.push({ texto: "Nome da categoria e muito pequeno" });
  }

  if (erros.length > 0) {
    res.render("admin/addcategorias", { erros: erros });

  } else {

    const novaCategoria = {

      nome: req.body.nome,
      slug: req.body.slug

    }

    new Categoria(novaCategoria).save().then(() => {

      req.flash("success_msg", "Categoria Criada Com Sucesso");

      //se o cadastro der certo vai ser redirecionado
      res.redirect("/admin/categorias");

    }).catch((err) => {

      req.flash("error_msg", "Houve um erro ao salvar a categoria, tente novamente");
      res.redirect("/admin");

    });

  }


});

//rota para editar uma categoria e mostrar os valores no campo para serem editador
rota.get("/categorias/edit/:id", (req, res) => {

  Categoria.findOne({ _id: req.params.id }).then((categoria) => {
    //categoria eh um objeto que pode ser usado na view
    res.render("admin/editcategorias", { categoria: categoria });

  }).catch((err) => {
    req.flash("error_msg", "Esta Categoria Nao Existe");
    res.redirect("/admin/categorias");
  });

});


rota.post("/categorias/edit", (req, res) => {

  Categoria.findOne({ _id: req.body.id }).then((categoria) => {

    var erros = []

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
      erros.push({ texto: "Nome Invalido" });
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {

      erros.push({ texto: "Slug Invalido" });
    }

    if (req.body.nome.length < 2) {
      erros.push({ texto: "Nome da categoria e muito pequeno" });
    }

    if (erros.length > 0) {
      res.render("admin/editcategorias", { categoria: categoria, erros: erros });

    } else {



      categoria.nome = req.body.nome;
      categoria.slug = req.body.slug;

      categoria.save().then(() => {

        req.flash("success_msg", "Categoria Editada com Sucesso");
        res.redirect("/admin/categorias");

      }).catch((err) => {

        req.flash("error_msg", "houve um erro interno ao salvar a edicao da categoria");
        res.redirect("/admin/categorias");

      });
    }

  }).catch((err) => {

    req.flash(("error_msg", "Houve um erro ao editar a categoria"));
    res.redirect("/admin/categorias");

  });


});


rota.post("/categorias/deletar", (req, res) => {

  Categoria.remove({ _id: req.body.id }).then(() => {

    req.flash("success_msg", "Categoria Deletada Com Sucesso!");
    res.redirect("/admin/categorias");

  }).catch((err) => {

    req.flash("error_msg", "houve um erro ao deletar uma categoria");
    res.redirect("/admin/categorias")

  });


});


rota.get("/postagens", (req, res) => {

  Postagem.find().populate("categoria").sort({ data: "desc" }).then((postagens) => {

    res.render("admin/postagens", { postagens: postagens });

  }).catch((err) => {

    req.flash("error_msg", "Houve um erro ao listar as postagens");
    res.redirect("/admin");

  });




});

//adiciona uma postagem
rota.get("/postagens/add", (req, res) => {

  Categoria.find().then((categorias) => {

    res.render("admin/addpostagem", { categorias: categorias });


  }).catch((err) => {

    req.flash("error_msg", "Houve um erro ao carregar o formulario");
    res.redirect("/admin");

  });



});


rota.post("/postagens/nova", (req, res) => {

  var erros = []

  if (req.body.categoria == "0") {

    erros.push({ texto: "categoria invalida, registre uma categoria" });

  }
  if (erros.length > 0) {
    res.render("admin/addpostagem", { erros: erros });
  } else {

    const novaPostagem = {

      titulo: req.body.titulo,
      descricao: req.body.descricao,
      conteudo: req.body.conteudo,
      categoria: req.body.categoria,
      slug: req.body.slug


    }
    new Postagem(novaPostagem).save().then(() => {
      req.flash("success_msg", "Postagem criada com sucesso!");
      res.redirect("/admin/postagens");

    }).catch((err) => {

      req.flash("error_msg", "houve um erro durante o salvamento da postagem");
      res.redirect("/admin/postagens");

    });

  }

});


rota.get("/postagens/edit/:id", (req, res) => {

  Postagem.findOne({ _id: req.params.id }).then((postagem) => {

    Categoria.find().then((categorias) => {

      res.render("admin/editpostagens", { categorias: categorias, postagem: postagem });

    }).catch((err) => {

      req.flash("error_msg", "Houve um erro ao listar as categorias");
      res.redirect("/admin/postagens");
    });


  }).catch((err) => {

    req.flash("error_msg", "Houve um erro ao carregar um formulario de edicao");
    res.redirect("/admin/postagen")

  });

});


rota.post("/postagem/edit", (req, res) => {

  Postagem.findOne({ _id: req.body.id }).then((postagem) => {
    postagem.titulo = req.body.titulo
    postagem.slug = req.body.slug
    postagem.descricao = req.body.descricao
    postagem.conteudo = req.body.conteudo
    postagem.categoria = req.body.categoria

    postagem.save().then(() => {

      req.flash("success_msg", "Postagem editada com sucesso!");
      res.redirect("/admin/postagens");

    }).catch((err) => {

      req.flash("error_msg", "Erro interno");
      res.redirect("/admin/postagens")

    });



  }).catch((err) => {

    req.flash("error_msg", "Houve um erro ao salvar a edicao");
    res.redirect("/admin/postagens");


  });



});


rota.get("/postagens/deletar/:id", (req, res) => {

  Postagem.remove({ _id: req.params.id }).then(() => {

    req.flash("success_msg", "postagem deletada com sucesso");
    res.redirect("/admin/postagens");

  }).catch((err) => {

    req.flash("error_msg", "Houve um erro interno");
    res.redirect("/admin/postagens");

  });



});

//ponto de coleta
rota.get('/pontocoleta/add', (req, res) => {


  res.render("admin/addpontocoleta");



});


rota.post("/pontocoleta/nova", (req, res) => {

  var erros = []

  if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
    erros.push({ texto: "Nome Invalido" });
  }

  if (!req.body.endereco || typeof req.body.endereco == undefined || req.body.endereco == null) {

    erros.push({ texto: "endereco Invalido" });
  }

  if (req.body.nome.length < 2) {
    erros.push({ texto: "Nome e muito pequeno" });
  }

  if (erros.length > 0) {
    res.render("admin/addpontocoleta", { erros: erros });

  } else {

    const novoPontoColeta = {

      nome: req.body.nome,
      endereco: req.body.endereco

    }

    new PontoColeta(novoPontoColeta).save().then(() => {

      req.flash("success_msg", "Ponto de coleta Criada Com Sucesso");

      //se o cadastro der certo vai ser redirecionado
      res.redirect("/admin/pontocoleta");

    }).catch((err) => {

      req.flash("error_msg", "Houve um erro ao salvar o Ponto de coleta, tente novamente");
      res.redirect("/admin");

    });

  }


});

rota.get("/pontocoleta", (req, res) => {


  //lista as categorias
  PontoColeta.find().sort({ date: 'desc' }).then((pontocoleta) => {
    res.render("admin/pontocoleta", { pontocoleta: pontocoleta });

  }).catch((err) => {

    req.flash("error_msg", "Houve um erro ao listar as categorias");
    res.redirect("/admin");

  });


});

/**NOTICIAS */

//adiciona uma postagem
rota.get("/noticias/add", (req, res) => {

  Noticias.find().then((noticias) => {

    res.render("admin/addNoticias", { noticias: noticias });


  }).catch((err) => {

    req.flash("error_msg", "Houve um erro ao carregar o formulario");
    res.redirect("/admin");

  });
});


rota.post("/noticias/nova", (req, res) => {

  var erros = []

  if (req.body.Noticia == "0") {

    erros.push({ texto: "kasjaksjaksia" });

  }
  if (erros.length > 0) {
    res.render("admin/addNoticias", { erros: erros });
  } else {

    const novaNoticia = {

      "titulo": req.body.titulo,
      "descricao": req.body.descricao,
      "conteudo": req.body.conteudo,
      "data": req.body.data,
      "imagem": req.body.imagem

    }
    new Noticia(novaNoticia).save().then(() => {
      req.flash("success_msg", "noticia adicionada com sucesso!");
      res.redirect("/admin/noticias");

    }).catch((err) => {

      req.flash("error_msg", "houve um erro durante o salvamento da noticia");
      res.redirect("/admin/noticias");

    });

  }

});


rota.get("/noticias", (req, res) => {


  //lista as noticias
  Noticias.find().sort({ date: 'desc' }).then((noticias) => {
    res.render("admin/noticias", { noticias: noticias });

  }).catch((err) => {

    req.flash("error_msg", "Houve um erro ao listar as noticias");
    res.redirect("/admin");

  });


});


//produto
rota.get('/produto/add', (req, res) => {

  res.render("admin/addproduto");

});

rota.post("/produto/nova", (req, res) => {

  var erros = []

  if (!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null) {
    erros.push({ texto: "Titulo Invalido" });
  }

  if (!req.body.subtitulo || typeof req.body.subtitulo == undefined || req.body.subtitulo == null) {

    erros.push({ texto: "Subtitulo Invalido" });
  }
  
  if (!req.body.texto || typeof req.body.texto == undefined || req.body.texto == null) {

    erros.push({ texto: "Texto Invalido" });
  }
  
  if (req.body.titulo.length < 2) {
    erros.push({ texto: "Titulo muito pequeno" });
  }
  
  if (req.body.subtitulo.length < 2) {
    erros.push({ texto: "Subtitulo muito pequeno" });
  }
  
  if (req.body.texto.length < 2) {
    erros.push({ texto: "Texto muito pequeno" });
  }
  

  if (erros.length > 0) {
    res.render("admin/addproduto", { erros: erros });

  } else {

    const novoProduto = {

      titulo: req.body.titulo,
      subtitulo: req.body.subtitulo,
	  texto: req.body.texto

    }

    new Produto(novoProduto).save().then(() => {

      req.flash("success_msg", "Produto Criado Com Sucesso");
      res.redirect("/admin/produto");
    }).catch((err) => {

      req.flash("error_msg", "Houve um erro ao salvar o Produto, tente novamente");
      res.redirect("/admin");

    });

  }

});

rota.get("/produto", (req, res) => {

  //lista as produtos
  Produto.find().sort({ date: 'desc' }).then((produto) => {
    res.render("admin/produto", { produto: produto });

  }).catch((err) => {

    req.flash("error_msg", "Houve um erro ao listar os Produtos");
    res.redirect("/admin");
  });
});



module.exports = rota;

