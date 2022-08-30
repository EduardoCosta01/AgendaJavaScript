const mongoose = require('mongoose');
const { async } = require('regenerator-runtime');
const validator = require('validator')

const ContatoSchema = new mongoose.Schema({
    nome: {type: String, required: true},
    sobrenome: {type: String, required: false, default: ''},
    email: {type: String, required: false, default: ''},
    telefone: {type: String, required: false, default: ''},
    criadoEm: {type: Date, default: Date.now},
});

const ContatoModel =  mongoose.model('Contato', ContatoSchema);


function Contato(body) {
    this.body = body;
    this.errors = [];
    this.contato = null;
};



Contato.prototype.register = async function() {
    this.valida();
    if(this.errors.length > 0) return;
    this.contato = await ContatoModel.create(this.body)
};

// Validar a senha e o email
Contato.prototype.valida = function() {
    this.cleanUp();
   // Validação
   
   // Oe-mail tem que ser valido
   if(this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail inválido.')
   if(!this.body.nome) this.errors.push('Nome é um campo obrigatorio');
   if(!this.body.email && !this.body.telefone) {
       this.errors.push('Precisa pelo menos de um contato: E-mail ou Telefone.')
   }
     
};

// garanti que tudo é uma string
Contato.prototype.cleanUp = function() {
    for(const key in this.body) {
        if(typeof this.body[key] !== 'string') {
            this.body[key] = '';
        };
    };

    // garanti que o objeto só tenha esses campos
    this.body = {
        nome: this.body.nome,
        sobrenome: this.body.sobrenome,
        email: this.body.email,
        telefone: this.body.telefone,
       
    };
};

Contato.prototype.edit = async function(id) {
    if(typeof id !== 'string') return;
    this.valida();
    if(this.errors.length > 0) return;
    const contato = await ContatoModel.findByIdAndUpdate(id, this.body, {new: true});

}

// Métodos estaticos
Contato.buscaPorId = async function(id) {
    if(typeof id !== 'string') return;
    const contato = await ContatoModel.findById(id);
    return contato;
};

Contato.buscaContatos = async function() {
        const contatos = await ContatoModel.find()
        .sort({criadoEm: -1});
    return contatos;
};

Contato.delete = async function(id) {
    if(typeof id !== 'string') return;
    const contato = await ContatoModel.findOneAndDelete();
    return contato;
}


module.exports = Contato;