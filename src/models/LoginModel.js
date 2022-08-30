const mongoose = require('mongoose');
const validator = require('validator');
const bcrytpjs = require('bcryptjs')

//Model
const loginSchema = new mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true}
    
});

const LoginModel =  mongoose.model('login', loginSchema);


class login {
    constructor(body) {
        this.body = body;
        this.errors =[];
        this.user = null;
    };
   
    // Entrar no sistema
    async login() {
        this.valida();
        if(this.errors.length > 0) return;
        this.user = await LoginModel.findOne({ email: this.body.email});

        // verificando se o usuario esta correta
        if(!this.user){
            this.errors.push('Usiário não existe.');
            return;
        };

        // verificando se a senha esta correta
        if(!bcrytpjs.compareSync(this.body.password, this.user.password)) {
            this.errors.push('Senha inválida');
            this.user = null;
            return;
        };
    }

    // Resistrar usuario
    async register() {
        this.valida();
        if(this.errors.length > 0) return;
        // Verifica se o usuario existe
        await this.userExists();

        if(this.errors.length > 0) return;


        // cripitografar a senha no banco de dados
        const salt = bcrytpjs.genSaltSync();
        this.body.password = bcrytpjs.hashSync(this.body.password, salt)

        // criando o usuario no banco de dados
        this.user = await LoginModel.create(this.body);
       
    };
    
    // verificar se o usuario ja foi cadastrato
    async userExists() {
        this.user = await LoginModel.findOne({ email: this.body.email});
        if(this.user) this.errors.push('Usuário ja existe.');
    };
    
    // Validar a senha e o email
    valida () {
        this.cleanUp();
       // Validação
       
       // Oe-mail tem que ser valido
       if(!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido.')
       
       // a senha tem que ter entre 3 e 7 
       if(this.body.password.length < 3 || this.body.password.length > 7) {
           this.errors.push('A senha precisa ter entre 3 e 7 caracteres.')
       };
    };

    // garanti que tudo é uma string
    cleanUp() {
        for(const key in this.body) {
            if(typeof this.body[key] !== 'string') {
                this.body[key] = '';
            };
        };

        // garanti que o objeto só tenha esses campos
        this.body = {
            email: this.body.email,
            password: this.body.password
        };
    }
}
module.exports = login;