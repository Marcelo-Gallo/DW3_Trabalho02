const express = require('express');
const routerApp = express.Router();
const appLogin = require('../apps/login/controller/ctlLogin');
const appFornecedor = require('../apps/fornecedores/controller/ctlFornecedores')

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

module.exports = routerApp;