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
// Tela de listagem/adição de itens (vinculada ao ID do pedido)
router.get('/itens/:id', authenticationMiddleware, appPedidos.itensView);
// Executa a inserção do item (POST do formulário da tela de itens)
router.post('/itens/insert', authenticationMiddleware, appPedidos.insertItem);
// Executa a remoção do item (GET link direto)
router.get('/itens/delete/:id/:pedidoid', authenticationMiddleware, appPedidos.deleteItem);

module.exports = router;