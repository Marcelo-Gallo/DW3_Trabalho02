const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config(); // busca a função .config() da lib dotenv e executa ela

const app = express(); //Cria a aplicação express
const port = 40000;

//-- Middlewares, isso roda em trodas as requisições
app.use(bodyParser.urlencoded({extended:false})); // tradutor de dados do form (x-www-form-urlencoded)
app.use(express.json()); // Decxodifica JSON do req.body (corpo da requisição)

app.listen(port, () => { // Inicia o servidor e fica ouvindo as requisições (trava o terminal)
    console.log(`Servidor rodando na porta ${port}`)
})