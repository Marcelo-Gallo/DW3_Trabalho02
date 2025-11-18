const express = require('express');
const routerApp = express.Router();
const appLogin = require('../apps/login/controller/ctlLogin');
const appFornecedores = require('../apps/fornecedores/controller/ctlFornecedores');
const appProdutos = require('../apps/produtos/controller/ctlProdutos');
const appPedidos = require('../apps/pedidos/controller/ctlPedidos');

routerApp.use((req, res, next) => {
    next();
});

routerApp.get('/', (req, res) => {
    res.send('Rota / está funcionando')
});

routerApp.post("/Register", appLogin.Register);
routerApp.post("/Login", appLogin.Login);
routerApp.post("/Logout", appLogin.Logout);

routerApp.post("/getAllFornecedores", appLogin.AutenticaJWT, appFornecedores.getAllFornecedores);
routerApp.post("/getFornecedorByID", appLogin.AutenticaJWT, appFornecedores.getFornecedorByID);
routerApp.post("/insertFornecedor", appLogin.AutenticaJWT, appFornecedores.insertFornecedor);
routerApp.post("/updateFornecedor", appLogin.AutenticaJWT, appFornecedores.updateFornecedor);
routerApp.post("/deleteFornecedor", appLogin.AutenticaJWT, appFornecedores.deleteFornecedor);

routerApp.post("/getAllProdutos", appLogin.AutenticaJWT, appProdutos.getAllProdutos);
routerApp.post("/getProdutoByID", appLogin.AutenticaJWT, appProdutos.getProdutoByID);
routerApp.post("/insertProduto", appLogin.AutenticaJWT, appProdutos.insertProduto);
routerApp.post("/updateProduto", appLogin.AutenticaJWT, appProdutos.updateProduto);
routerApp.post("/deleteProduto", appLogin.AutenticaJWT, appProdutos.deleteProduto);

routerApp.post("/getAllPedidos", appLogin.AutenticaJWT, appPedidos.getAllPedidos);
routerApp.post("/getPedidoByID", appLogin.AutenticaJWT, appPedidos.getPedidoByID);
routerApp.post("/insertPedido", appLogin.AutenticaJWT, appPedidos.insertPedido);
routerApp.post("/updatePedido", appLogin.AutenticaJWT, appPedidos.updatePedido);
routerApp.post("/deletePedido", appLogin.AutenticaJWT, appPedidos.deletePedido);

module.exports = routerApp;