const { async } = require('regenerator-runtime');
const Login = require('../models/LoginModel');

exports.index = (req, res) => {
    console.log(req.session.user)
    if(req.session.user) return res.render('login');
    return res.render('login');
};

// Rota de registrar
exports.register = async function(req, res) {
    try {
        const login = new Login(req.body);
        await login.register();

        if(login.errors.length > 0) {
            req.flash('errors', login.errors);
            req.session.save(function() {
                return res.redirect('back');
        });
            return;
        }

        req.flash('success', 'Seu usuário foi criado com sucesso');
        req.session.save(function() {
            return res.redirect('back');
    });

    }   catch(e) {
        console.log(e);
        return res.render('404')
    };
};

exports.login = async function(req, res) {
    try {
        const login = new Login(req.body);
        await login.login();

        if(login.errors.length > 0) {
            req.flash('errors', login.errors);
            req.session.save(function() {
                return res.redirect('back');
        });
            return;
        }

        req.flash('success', 'Você entrou no sistema.');
        req.session.user = login.user;

        req.session.save(function(err,success) {
            if(err)
            req.flash('errors', "Erro ao realizar o login");

            return res.redirect('back');
        });
    } catch(e) {
        return res.render('404')
    }
};

exports.logout = function (req, res) {
    req.session.destroy();
    res.redirect('back');
}
