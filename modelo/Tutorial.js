const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tutorial = new Schema({
    titulo: {
        type: String,
    },
    subtitulo: {
        type: String,
    },
    data: {
        type: Date,
        default: Date.now()
    },
    texto: {
        type: String,
    },
    autor: {
        type: String,
    },
    imagem: {
        type: String,
    },
    video: {
        type: String,
    },
    audio: {
        type: String,
    }        
});

mongoose.model("Tutorial", tutorial);