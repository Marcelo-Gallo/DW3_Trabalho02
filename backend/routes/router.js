const express = require('express');
const routerApp = express.Router();
const appLogin = require('../apps/login/controller/ctlLogin');
const appFornecedores = require('../apps/fornecedores/controller/ctlFornecedores');
const appProdutos = require('../apps/produtos/controller/ctlProdutos');
const appPedidos = require('../apps/pedidos/controller/ctlPedidos');
const appItensPedido = require('../apps/itensPedidos/controller/ctlItemPedido');

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
routerApp.post("/insertFornecedor", appLogin.AutenticaJWT, appLogin.AutorizaAdmin, appFornecedores.insertFornecedor);
routerApp.post("/updateFornecedor", appLogin.AutenticaJWT, appLogin.AutorizaAdmin, appFornecedores.updateFornecedor);
routerApp.post("/deleteFornecedor", appLogin.AutenticaJWT, appLogin.AutorizaAdmin, appFornecedores.deleteFornecedor);

routerApp.post("/getAllProdutos", appLogin.AutenticaJWT, appProdutos.getAllProdutos);
routerApp.post("/getProdutoByID", appLogin.AutenticaJWT, appProdutos.getProdutoByID);
routerApp.post("/insertProduto", appLogin.AutenticaJWT, appLogin.AutorizaAdmin, appProdutos.insertProduto);
routerApp.post("/updateProduto", appLogin.AutenticaJWT, appLogin.AutorizaAdmin, appProdutos.updateProduto);
routerApp.post("/deleteProduto", appLogin.AutenticaJWT, appLogin.AutorizaAdmin, appProdutos.deleteProduto);

routerApp.post("/getAllPedidos", appLogin.AutenticaJWT, appPedidos.getAllPedidos);
routerApp.post("/getPedidoByID", appLogin.AutenticaJWT, appPedidos.getPedidoByID);
routerApp.post("/insertPedido", appLogin.AutenticaJWT, appLogin.AutorizaAdmin, appPedidos.insertPedido);
routerApp.post("/updatePedido", appLogin.AutenticaJWT, appLogin.AutorizaAdmin, appPedidos.updatePedido);
routerApp.post("/deletePedido", appLogin.AutenticaJWT, appLogin.AutorizaAdmin, appPedidos.deletePedido);

routerApp.post("/getAllItensPedido", appLogin.AutenticaJWT, appItensPedido.getAllItensPedido);
routerApp.post("/getItemPedidoByID", appLogin.AutenticaJWT, appItensPedido.getItemPedidoByID);
routerApp.post("/insertItemPedido", appLogin.AutenticaJWT, appLogin.AutorizaAdmin, appItensPedido.insertItemPedido);
routerApp.post("/updateItemPedido", appLogin.AutenticaJWT, appLogin.AutorizaAdmin, appItensPedido.updateItemPedido);
routerApp.post("/deleteItemPedido", appLogin.AutenticaJWT, appLogin.AutorizaAdmin, appItensPedido.deleteItemPedido);

routerApp.post("/deleteItensByPedidoID", appLogin.AutenticaJWT, appItensPedido.deleteItensByPedidoID);

module.exports = routerApp;