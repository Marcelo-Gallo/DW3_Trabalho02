const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
require('dotenv').config();

//app.set configura variaveis globais do app
//app.use seta middlewares que processam a requisição sequencialmente

app.set('view engine', 'ejs'); //seta ejs como view engine
app.set('views', './views'); //define ./views como diretório onde estão os arquivos de visualização

app.use(express.static('public')); //entrega o arquivo se a requisição pedir, caso contrário segue adiante
app.use(bodyParser.urlencoded({ extended: true })); //traduz os dados da req.body
app.use(bodyParser.json());

app.use(session({ //verifica cookie, recupera o tokenJWT e coloca no req.session
  secret: 'meusegredousupersecreto',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

const router = require('./routes/index'); //rota principal
const fornecedores = require('./routes/fornecedores'); //rota de fornecedores
const usuarios = require('./routes/usuarios'); 
const produtos = require('./routes/produtos'); //rota de produtos
const pedidos = require('./routes/pedidos');   //rota de pedidos

app.use('/', router); //joga para o rotas redirecionar
app.use('/fornecedores', fornecedores); 
app.use('/usuarios', usuarios); 
app.use('/produtos', produtos);
app.use('/pedidos', pedidos);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Frontend rodando em http://localhost:${port}`);
});