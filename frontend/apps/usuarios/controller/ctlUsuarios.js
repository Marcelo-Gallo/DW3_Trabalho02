const axios = require('axios');

exports.ViewCadastro = (req, res) => {
    res.render("usuarios/cadastro", {
        title: "Cadastrar Usuário",
        message: null
    });
};

exports.CadastrarUsuario = async (req, res) => {
    const { username, password } = req.body;
     console.log("BODY RECEBIDO:", req.body);

    try {
        const resp = await axios.post(process.env.SERVIDOR_DW3 + "/Register", {
            username,
            password
        });

        return res.render("usuarios/cadastro", {
            title: "Cadastrar Usuário",
            message: "Usuário criado com sucesso!"
        });

    } catch (error) {
        console.error("ERRO AO CADASTRAR:", error.response?.data || error);

        return res.render("usuarios/cadastro", {
            title: "Cadastrar Usuário",
            message: "Erro ao cadastrar usuário"
        });
    }
};
