const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Produto = new Schema({

    titulo: {
        type: String,
    },
    subtitulo: {
        type: String,
    },
    autor: {

        type: String,
    },
    texto: {
        type: String,
    },
    data: {
    type: Date,
    default: Date.now()
    },
    textocom: {
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
    }
});

mongoose.model("produto", Produto);
