const { async } = require('regenerator-runtime')
const Contato = require('../models/contatoModel')

exports.index = async (req, res) => {
    const contatos = await Contato.buscaContatos();    
    res.render('index', { contatos } )

};

