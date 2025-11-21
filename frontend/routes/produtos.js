const express = require('express');
const router = express.Router();
const appProdutos = require("../apps/produtos/controller/ctlProdutos");

// Middleware de Autenticação
function authenticationMiddleware(req, res, next) {
    const isLogged = req.session.isLogged;
    if (!isLogged) {
        return res.redirect("/Login");
    }
    next();
}

// Listagem completa (CRUD)
router.get("/", authenticationMiddleware, appProdutos.getAllProdutos);

// Formulário de novo produto
router.get("/novo", authenticationMiddleware, (req, res) => {
    res.render("produtos/viewProdutos", {
        title: "Cadastro de Produto",
        data: null,
        userName: req.session.userName,
        message: null
    });
});

router.get("/edit/:id", authenticationMiddleware, appProdutos.getProdutoByID);
router.post("/insert", authenticationMiddleware, appProdutos.insertProduto);
router.post("/update", authenticationMiddleware, appProdutos.updateProduto);
router.get("/delete/:id", authenticationMiddleware, appProdutos.deleteProduto);

module.exports = router;