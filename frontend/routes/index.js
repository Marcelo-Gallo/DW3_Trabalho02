const express = require('express');
const router = express.Router();
const axios = require('axios');

const loginController = require('../apps/login/controller/ctlLogin');

// --- Middleware de Autenticação (Segurança do Front)
function authenticationMiddleware(req, res, next) { // Função que verifica se existe token na sessão  
    if (!req.session.isLogged) {
      return res.redirect("/Login");
    }
    next();// Se estiver logado, deixa passar (next)
}

// --- Definição das Rotas ---
// Rota da Home --Protegida--
// Só entra se passar pelo authenticationMiddleware
router.get('/', authenticationMiddleware, async (req, res) => {
    // Pega o nome do usuário da sessão para mostrar na tela
    const userName = req.session.userName;
    const token = req.session.token;

    try {
        // Chamamos as 3 APIs em paralelo para pegar os totais
        // (Reutilizamos as APIs de getAll que já criamos - Reuso de Código!)
        const [respFornecedores, respProdutos, respPedidos] = await Promise.all([
            axios.post(process.env.SERVIDOR_DW3 + "/getAllFornecedores", {}, { headers: { Authorization: "Bearer " + token } }),
            axios.post(process.env.SERVIDOR_DW3 + "/getAllProdutos", {}, { headers: { Authorization: "Bearer " + token } }),
            axios.post(process.env.SERVIDOR_DW3 + "/getAllPedidos", {}, { headers: { Authorization: "Bearer " + token } })
        ]);

        res.render('index', { 
            title: 'Dashboard - Módulo de Compras', 
            userName: userName,
            qtdFornecedores: respFornecedores.data.registro.length,
            qtdProdutos: respProdutos.data.registro.length,
            qtdPedidos: respPedidos.data.registro.length
        });

    } catch (error) {
        console.error("[Dashboard] Erro ao carregar dados:", error.message);
        // Se der erro, carrega zerado para não travar o sistema
        res.render('index', { 
            title: 'Dashboard - Offline', 
            userName: userName,
            qtdFornecedores: '-', 
            qtdProdutos: '-', 
            qtdPedidos: '-' 
        });
    }


});

// Rotas de Login --Públicas--
// GET: Mostra o formulário
router.get('/Login', loginController.LoginView);
// POST: Recebe os dados do formulário
router.post('/Login', loginController.LoginExec);
router.get('/Logout', loginController.Logout);

module.exports = router;