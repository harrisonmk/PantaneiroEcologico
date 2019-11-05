

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Noticias = new Schema({

    titulo: {
        type: String,
        required: true


    },

  

    descricao: {

        type: String,
        required: true


    },

    conteudo: {

        type: String,
        required: true

    },

    imagem:  {
      type: String,
      required: true


    },
   
   
    data: {

        type: Date,
        default: Date.now()

    }


});

mongoose.model("noticias", Noticias);
