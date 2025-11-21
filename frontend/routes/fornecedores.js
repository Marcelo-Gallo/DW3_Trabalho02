const express = require('express');
const router = express.Router();
const appFornecedores = require("../apps/fornecedores/controller/ctlFornecedores");

// Middleware de Autenticação
function authenticationMiddleware(req, res, next) {
    const isLogged = req.session.isLogged;
    if (!isLogged) {
        return res.redirect("/Login");
    }
    next();
}

// Listagem completa (CRUD)
router.get("/", authenticationMiddleware, appFornecedores.getAllFornecedores);

// Formulário de novo fornecedor
router.get("/novo", authenticationMiddleware, (req, res) => {
    res.render("fornecedores/viewFornecedores", {
        title: "Cadastro de Fornecedor",
        data: null,
        userName: req.session.userName,
        message: null
    });
});

router.get("/edit/:id", authenticationMiddleware, appFornecedores.getFornecedorByID);
router.post("/insert", authenticationMiddleware, appFornecedores.insertFornecedor);
router.post("/update", authenticationMiddleware, appFornecedores.updateFornecedor);
router.get("/delete/:id", authenticationMiddleware, appFornecedores.deleteFornecedor);

module.exports = router;
