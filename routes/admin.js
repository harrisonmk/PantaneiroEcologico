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

require("../modelo/Tutorial");
const Tutorial = mongoose.model("Tutorial");

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

// ***********************  ponto de coleta ********************************

rota.get('/pontocoleta/add', (req, res) => {


  res.render("admin/addpontocoleta");



});

 // adiciona um ponto de coleta
rota.post("/pontocoleta/nova", (req, res) => {

  var erros = [];
  var resultado;
  var itens;

  if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
    erros.push({ texto: "Nome Invalido" });
  }

  if (!req.body.bairro || typeof req.body.bairro == undefined || req.body.bairro == null) {

    erros.push({ texto: "bairro Invalido" });
  }
  if (!req.body.rua || typeof req.body.rua == undefined || req.body.rua == null) {

    erros.push({ texto: "rua Invalida" });
  }

  if (!req.body.numero || typeof req.body.numero == undefined || req.body.numero == null) {

    erros.push({ texto: "numero Invalido" });
  }

    


  if (req.body.nome.length < 5) {
    erros.push({ texto: "Nome e muito pequeno" });
  }

  if (erros.length > 0) {
    res.render("admin/addpontocoleta", { erros: erros });

  } else {

    const novoPontoColeta = {

      nome: req.body.nome,
      bairro: req.body.bairro,
      rua: req.body.rua,
      numero: req.body.numero,
      horarioAtendimento : req.body.horarioAtendimento,
      itens: req.body.itens.split(",")
      
      

    };

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


  //lista os pontos de coleta
  PontoColeta.find().sort({ date: 'desc' }).then((pontocoleta) => {
    res.render("admin/pontocoleta", { pontocoleta: pontocoleta });

  }).catch((err) => {

    req.flash("error_msg", "Houve um erro ao listar as categorias");
    res.redirect("/admin");

  });


});


//rota para editar um pontocoleta e mostrar os valores no campo para serem editador
rota.get("/ponto-coleta/edit/:id", (req, res) => {

  PontoColeta.findOne({ _id: req.params.id }).then((pontocoleta) => {
    //categoria eh um objeto que pode ser usado na view
    res.render("admin/editpontocoleta", { pontocoleta: pontocoleta });

  }).catch((err) => {
    req.flash("error_msg", "Esta Categoria Nao Existe");
    res.redirect("/admin/pontocoleta");
  });

});


rota.post("/ponto-coleta/edit", (req, res) => {

  PontoColeta.findOne({ _id: req.body.id }).then((pontocoleta) => {

    var erros = [];

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
      erros.push({ texto: "Nome Invalido" });
    }
  
    if (!req.body.bairro || typeof req.body.bairro == undefined || req.body.bairro == null) {
  
      erros.push({ texto: "bairro Invalido" });
    }
    if (!req.body.rua || typeof req.body.rua == undefined || req.body.rua == null) {
  
      erros.push({ texto: "rua Invalida" });
    }
  
    if (!req.body.numero || typeof req.body.numero == undefined || req.body.numero == null) {
  
      erros.push({ texto: "numero Invalido" });
    }
    if (req.body.nome.length < 2) {
      erros.push({ texto: "Nome  muito pequeno" });
    }

    if (erros.length > 0) {
      res.render("admin/editpontocoleta", { pontocoleta: pontocoleta, erros: erros });

    } else {

      pontocoleta.nome=req.body.nome;
      pontocoleta.bairro= req.body.bairro;
      pontocoleta.rua= req.body.rua;
      pontocoleta.numero= req.body.numero;
      pontocoleta.horarioAtendimento = req.body.horarioAtendimento;
      pontocoleta.itens = req.body.itens.split(",");
       

      pontocoleta.save().then(() => {

        req.flash("success_msg", "ponto de coleta Editada com Sucesso");
        res.redirect("/admin/pontocoleta");

      }).catch((err) => {

        req.flash("error_msg", "houve um erro interno ao salvar a edicao da categoria");
        res.redirect("/admin/pontocoleta");

      });
    }

  }).catch((err) => {

    req.flash(("error_msg", "Houve um erro ao editar a categoria"));
    res.redirect("/admin/pontocoleta");

  });


});


//metodo para deletar um ponto de coleta
rota.post("/ponto-coleta/deletar", (req, res) => {

  PontoColeta.remove({ _id: req.body.id }).then(() => {

    req.flash("success_msg", "Categoria Deletada Com Sucesso!");
    res.redirect("/admin/pontocoleta");

  }).catch((err) => {

    req.flash("error_msg", "houve um erro ao deletar uma categoria");
    res.redirect("/admin/pontocoleta");

  });


});

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

  var erros = [];

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
      "slug": req.body.slug,
      "imagem": req.body.imagem,
      "video": req.body.video,
      "audio": req.body.audio,
      "data": req.body.data
      

    }
    new Noticias(novaNoticia).save().then(() => {
      req.flash("success_msg", "noticia adicionada com sucesso!");
      res.redirect("/admin/noticias");

    }).catch((err) => {

      req.flash("error_msg", "houve um erro durante o salvamento da noticia");
      res.redirect("/admin/noticias");

    });

  }

});



rota.get("/noticias", (req, res) => {


  //lista as categorias
  Noticias.find().sort({ date: 'desc' }).then((noticias) => {
    res.render("admin/noticias", { noticias: noticias });

  }).catch((err) => {

    req.flash("error_msg", "Houve um erro ao listar as noticias");
    res.redirect("/admin");

  });


});



//*************************** Tutoriais inicializa aqui **************************/
//resposanvel pela pagina de gerenciaciamento  dos tutoriais
rota.get("/tutoriais", (req, res) => {
  //metodo resposanvel pro buscar a data de cada tutorial e coletar todos seus atributos
  Tutorial.find().sort({ date: 'desc' }).then((tutorial) => {
    //pega o arquivo de localizao da pagina de gerenciamento
    res.render("admin/controllerTutorial/tutoriais", { tutorial: tutorial });
    //funcao caso der errado
  }).catch((err) => {
    //mensagem de erro caso der muito errado
    req.flash("error_msg", "Houve um erro ao listar os Tutoriais");
    //caso der ruim sera direcionado para a oagin
    res.redirect("/admin");
  });
});
//rota responsavel por rendenirizar a pagina de tutoriais add
rota.get('/tutoriais/add', (req, res) => {
  //res e um metodo responsavel pelo caminho do arquivo que sera rendenerizado 
  res.render("admin/controllerTutorial/addtutorial");
});
//rota resposnsavel por receber metodo post
rota.post("/tutoriais/nova", (req, res) => {
  //consta que recebe os valores dos campos de input da página de adicionar novos tutoriais
  const novaTutorial = {
    //atributo de dentro da collection que extrai os campos equivalentes do form html
    titulo: req.body.titulo,
    subtitulo: req.body.subtitulo,
    texto: req.body.texto,
    autor: req.body.autor
  }
  //metodo resposanvel por salvar o novo tutorial 
  new Tutorial(novaTutorial).save().then(() => {
    //mensagem de sucesso caso der certo
    req.flash("success_msg", "Tutorial Criado com Sucesso");
    //redirecionar para area de gernciamento caso for sucessso
    res.redirect("/admin/tutoriais");
    //caso erro
  }).catch((err) => {
    //mensagem de erro
    req.flash("error_msg", "Houve um erro ao salvar o tutorial, tente novamente");
    //direcionamento para pagina de gerencimamento
    res.redirect("/admin/tutoriais");
  });

});

//rota responsavel por receber o id do tutorial 
rota.get("/tutoriais/edit/:id", (req, res) => {
  //metodo responsavel por buscar o id na collection e extrair os dados e rendenerizar no moemnto de editar
  Tutorial.findOne({ _id: req.params.id }).then((tutorial) => {
    //rendeneriza os dados na página de edicao
    res.render("admin/controllerTutorial/edittutorial", { tutorial: tutorial });
//caso der merda
  }).catch((err) => {
    //mesangem de erro caso der ruim
    req.flash("error_msg", "O tutorial Nao Existe");
    //redirecionamento para area de gerenciamento
    res.redirect("/admin/tutoriais");
  });
});
//rota responsavel por realizar requisicao do tutorial pelo id extraindo dado por dado contido na parte interna
rota.post("/tutoriais/edit", (req, res) => {
  //metodo responsavel por realizar a busca do id dentro da collection para extrair atributos
  Tutorial.findOne({ _id: req.body.id }).then((tutorial) => {
    //var e responsavel por mostrar os erros 
    var erros = [];
    //atributos tutorial isntancionando atributo da coletion e realizando requisicao do post apos alteracoes
    tutorial.titulo = req.body.titulo;
    tutorial.subtitulo = req.body.subtitulo;
    tutorial.texto = req.body.texto;
    tutorial.autor = req.body.autor;
    //metodo que salva as modificacoes dentro do banco subescrevendo
    tutorial.save().then(() => {
      //mensagem de sucesso
      req.flash("success_msg", "Tutorial Editado com Sucesso");
      //redirecionamento para area de gerenciamento
      res.redirect("/admin/tutoriais");
      //caso erro
    }).catch((err) => {
      //mesangem de erro
      req.flash("error_msg", "houve um erro interno ao salvar a edicao da categoria");
      //redirecionameneto para area de gerenciamento
      res.redirect("/admin/tutoriais");
    });
  }).catch((err) => {
    req.flash(("error_msg", "Houve um erro ao editar o tutorial"));
    res.redirect("/admin/tutoriais");
  });
});

//apagar o tutorial usando id 
rota.post("/tutoriais/deletar", (req, res) => {
  //metodo responsavel  pela remoção
  Tutorial.remove({ _id: req.body.id }).then(() => {
    //mensagem de sucesso
    req.flash("success_msg", "Tutorial Deletado Com Sucesso!");
    //redirecionanmento apos conclusao de acao
    res.redirect("/admin/tutoriais");
    //parametro  de erro
  }).catch((err) => {
    //mensagem de erro caso der merda
    req.flash("error_msg", "houve um erro ao deletar o tutorial");
    //redirecionamento para pagina de gerenciamento
    res.redirect("/admin/tutoriais");
  });
});



// ***********************  Produtos ********************************//

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

  // *********************** Listar os Produtos ********************************//

  Produto.find().sort({ date: 'desc' }).then((produto) => {
    res.render("admin/produto", { produto: produto });

  }).catch((err) => {

    req.flash("error_msg", "Houve um erro ao listar os Produtos");
    res.redirect("/admin");
  });
});

  // *******************************************************//

rota.get("/produto/edit/:id", (req, res) => {

  Produto.findOne({ _id: req.params.id }).then((produto) => {
  
    res.render("admin/editproduto", { produto: produto });

  }).catch((err) => {
    req.flash("error_msg", "O produto Não Existe");
    res.redirect("/admin/produto");
  });

});


rota.post("/produto/edit", (req, res) => {

  Produto.findOne({ _id: req.body.id }).then((produto) => {

    var erros = [];

    if (!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null) {
      erros.push({ texto: "Título Invalido" });
    }
  
    if (!req.body.subtitulo || typeof req.body.subtitulo == undefined || req.body.subtitulo == null) {
  
      erros.push({ texto: "Subtítulo Invalido" });
    }
    if (!req.body.texto || typeof req.body.texto == undefined || req.body.texto == null) {
  
      erros.push({ texto: "Texto Invalido" });
    }

    if (erros.length > 0) {
      res.render("admin/editproduto", { produto: produto, erros: erros });

    } else {

      produto.titulo=req.body.titulo;
      produto.subtitulo= req.body.subtitulo;
      produto.texto= req.body.texto;

      produto.save().then(() => {

        req.flash("success_msg", "Produto Editado com Sucesso");
        res.redirect("/admin/produto");

      }).catch((err) => {

        req.flash("error_msg", "Houve um erro interno ao salvar a edicao do Produto");
        res.redirect("/admin/produto");

      });
    }

  }).catch((err) => {

    req.flash(("error_msg", "Houve um erro ao editar o produto"));
    res.redirect("/admin/produto");

  });


});

// *********************** Deletar Produtos ********************************//

rota.post("/produto/deletar", (req, res) => {

  Produto.remove({ _id: req.body.id }).then(() => {

    req.flash("success_msg", "Produto Deletado Com Sucesso!");
    res.redirect("/admin/produto");

  }).catch((err) => {

    req.flash("error_msg", "houve um erro ao deletar o produto");
    res.redirect("/admin/produto");

  });


});

 // *******************************************************//


module.exports = rota;

