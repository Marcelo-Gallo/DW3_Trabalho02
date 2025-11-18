const express = require('express');
const routerApp = express.Router();
const appLogin = require('../apps/login/controller/ctlLogin');

routerApp.use((req, res, next) => {
    next();
});

routerApp.get('/', (req, res) => {
    res.send('Rota / está funcionando')
});

routerApp.post("/Register", appLogin.Register);
routerApp.post("/Login", appLogin.Login);       
routerApp.post("/Logout", appLogin.Logout);     

module.exports = routerApp;