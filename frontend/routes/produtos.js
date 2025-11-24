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

router.get("/novo", authenticationMiddleware, appProdutos.openProdutoInsert);

router.get("/edit/:id", authenticationMiddleware, appProdutos.getProdutoByID);
router.post("/insert", authenticationMiddleware, appProdutos.insertProduto);
router.post("/update", authenticationMiddleware, appProdutos.updateProduto);
router.get("/delete/:id", authenticationMiddleware, appProdutos.deleteProduto);

module.exports = router;