const jwt = require("jsonwebtoken");
const bCrypt = require("bcryptjs"); // Para criptografar e comparar
const mdlLogin = require("../model/mdlLogin");

const Login = async (req, res, next) => {
  const credencial = await mdlLogin.GetCredencial(req.body.username);

  if (credencial.length == 0) {
    return res.status(200).json({ message: "Usuário não identificado!" });
  }

  if (bCrypt.compareSync(req.body.password, credencial[0].password)) {
    const username = credencial[0].username;
    const token = jwt.sign({ username }, process.env.SECRET_API, {
      expiresIn: 600,
    });
    return res.json({ auth: true, token: token });
  }

  res.status(200).json({ message: "Login inválido!" });
};

const Register = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const hashedPassword = bCrypt.hashSync(password, 10);

    const novoUsuario = await mdlLogin.InsertUsuario(username, hashedPassword);
    
    res.status(201).json({ status: "ok", usuario: novoUsuario[0].username });

  } catch (error) {
    res.status(500).json({ status: "erro", message: error.message });
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
    next();
  });
};

module.exports = {
  Login,
  Register,
  Logout,
  AutenticaJWT,
};