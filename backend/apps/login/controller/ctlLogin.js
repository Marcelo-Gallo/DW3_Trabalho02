const jwt = require("jsonwebtoken");
const bCrypt = require("bcryptjs"); 
const mdlLogin = require("../model/mdlLogin");

const Login = async (req, res, next) => {
  const credencial = await mdlLogin.GetCredencial(req.body.username);

  if (credencial.length == 0) {
    return res.status(200).json({ message: "Usuário não identificado!" });
  }

  if (bCrypt.compareSync(req.body.password, credencial[0].password)) {
    const username = credencial[0].username;

    const isadmin = credencial[0].isadmin; 

    const token = jwt.sign({ username, isadmin }, process.env.SECRET_API, {
      expiresIn: 600,
    });

    return res.json({ auth: true, token: token, isadmin: isadmin });
  }

  res.status(200).json({ message: "Login inválido!" });
};

const Register = async (req, res, next) => {
  try {
    const { username, password, confirmPassword } = req.body;
    
    if (!password || !confirmPassword) {
        return res.status(400).json({ status: "erro", message: "Preencha a senha e a confirmação!" });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ status: "erro", message: "As senhas não coincidem!" });
    }

    const hashedPassword = bCrypt.hashSync(password, 10);

    const novoUsuario = await mdlLogin.InsertUsuario(username, hashedPassword, false);
    
    res.status(201).json({ status: "ok", usuario: novoUsuario[0].username });

  } catch (error) {
    if (error.code === '23505') {
        return res.status(400).json({ 
            status: "erro", 
            message: "Este nome de usuário já está em uso. Escolha outro." 
        });
    }
    console.error("Erro no Registro:", error.message);
    res.status(500).json({ status: "erro", message: "Erro interno ao cadastrar usuário." });
  }
};

const Logout = (req, res, next) => {
  res.json({ auth: false, token: null });
};

const AutenticaJWT = (req, res, next) => {
  const tokenHeader = req.headers["authorization"];
  if (!tokenHeader)
    return res
      .status(200)
      .json({ auth: false, message: "Não foi informado o token JWT" });

  const bearer = tokenHeader.split(" ");
  const token = bearer[1];
  
  jwt.verify(token, process.env.SECRET_API, function (err, decoded) {
    if (err)
      return res
        .status(200)
        .json({ auth: false, message: "JWT inválido ou expirado" });
    
    req.username = decoded.username; 
    req.isadmin = decoded.isadmin; // Agora isso vai funcionar!
    next();
  });
};

const AutorizaAdmin = (req, res, next) => {
    if (!req.isadmin) {
        return res.status(403).json({ status: "erro", message: "Acesso Negado: Apenas Admin." });
    }
    next();
};

module.exports = {
  Login,
  Register,
  Logout,
  AutenticaJWT,
  AutorizaAdmin,
};