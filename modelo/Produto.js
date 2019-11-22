const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Produto = new Schema({

    titulo: {
        type: String,
        required: true


    },


    subtitulo: {

        type: String,
        required: true


    },

    autor: {

        type: String,
        required: true

    },

    data: {

        type: Date,
        default: Date.now()

    },

    texto: {

        type: String,
        required: true

    },

    textocom: {

        type: String,
        required: true

    },

    imagem:  {
      type: String,
      required: true


    },

    video: {
        type: String,
        required: true
    },

    audio: {
        type: String,
        required: true
    }

});

mongoose.model("produto", Produto);
