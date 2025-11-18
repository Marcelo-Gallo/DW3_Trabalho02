const express = require('express');
const router = express.Router();

const loginController = require('../apps/login/controller/ctlLogin');

// --- Middleware de Autenticação (Segurança do Front)
function authenticationMiddleware(req, res, next) { // Função que verifica se existe token na sessão
    const isLogged = req.session.isLogged;
  
    if (!isLogged) {
      return res.redirect("/Login");
    }
    next();// Se estiver logado, deixa passar (next)
}

// --- Definição das Rotas ---

// Rota da Home --Protegida--
// Só entra se passar pelo authenticationMiddleware
router.get('/', authenticationMiddleware, (req, res) => {
    // Pega o nome do usuário da sessão para mostrar na tela
    const userName = req.session.userName;
    res.render('index', { title: 'Módulo de Compras', userName: userName });
});

// Rotas de Login --Públicas--
// GET: Mostra o formulário
router.get('/Login', loginController.LoginView);
// POST: Recebe os dados do formulário
router.post('/Login', loginController.LoginExec);



router.get('/Logout', loginController.Logout);

module.exports = router;