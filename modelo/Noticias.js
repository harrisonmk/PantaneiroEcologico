

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Noticias = new Schema({

    titulo: {
        type: String,
    },
    autor: {
        type: String,
    },
    descricao: {
        type: String,
    },
    conteudo: {
        type: String,

    },
    imagem:  {
      type: String,
    },

    video: {
        type: String,
    },
    audio: {
        type: String,  
    },
    data: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model("noticias", Noticias);
