const express = require('express');
const router = express.Router();
const appPedidos = require("../apps/pedidos/controller/ctlPedidos");

// Middleware de Autenticação
function authenticationMiddleware(req, res, next) {
    const isLogged = req.session.isLogged;
    if (!isLogged) {
        return res.redirect("/Login");
    }
    next();
}

// Listagem
router.get("/", authenticationMiddleware, appPedidos.getAllPedidos);

// Formulário Novo (Chama Controller para buscar fornecedores)
router.get("/novo", authenticationMiddleware, appPedidos.abrirFormularioInsert);

router.get("/edit/:id", authenticationMiddleware, appPedidos.getPedidoByID);
router.post("/insert", authenticationMiddleware, appPedidos.insertPedido);
router.post("/update", authenticationMiddleware, appPedidos.updatePedido);
router.get("/delete/:id", authenticationMiddleware, appPedidos.deletePedido);

module.exports = router;