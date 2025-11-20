const express = require('express');
const router = express.Router();
const fornecedoresApp = require("../apps/fornecedores/controller/ctlFornecedores");

// Middleware de Autenticação (Reutilizando a lógica do index.js)
function authenticationMiddleware(req, res, next) {
    const isLogged = req.session.isLogged;
    if (!isLogged) {
      return res.redirect("/Login");
    }
    next();
}

// Rotas:
// GET /fornecedores
router.get('/', authenticationMiddleware, fornecedoresApp.getAllFornecedores);

module.exports = router;