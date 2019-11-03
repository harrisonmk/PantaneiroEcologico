const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PontoColeta = new Schema({

    nome: {
        type: String,
        required: true


    },

    endereco: {
        type: String,
        required: true


    },


    data: {

        type: Date,
        default: Date.now()

    }

});

mongoose.model("pontocoleta", PontoColeta);