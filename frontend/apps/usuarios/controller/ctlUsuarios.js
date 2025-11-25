const axios = require('axios');

exports.ViewCadastro = (req, res) => {
    res.render("usuarios/cadastro", {
        title: "Cadastrar Usuário",
        message: null
    });
};

exports.CadastrarUsuario = async (req, res) => {
    
    const { username, password, confirmPassword } = req.body;
    console.log("BODY RECEBIDO:", req.body);

    //valida no front tbm
    if (password !== confirmPassword) {
        return res.render("usuarios/cadastro", {
            title: "Cadastrar Usuário",
            message: "Erro: As senhas não conferem!"
        });
    }

    try {
        const resp = await axios.post(process.env.SERVIDOR_DW3 + "/Register", {
            username,
            password,
            confirmPassword
        });

        if (resp.data.status === "ok") {
            return res.render("usuarios/cadastro", {
                title: "Cadastrar Usuário",
                message: "Sucesso: Usuário criado com sucesso!"
            });
        } else {
            return res.render("usuarios/cadastro", {
                title: "Cadastrar Usuário",
                message: "Erro: " + (resp.data.message || "Erro desconhecido")
            });
        }

    } catch (error) {
        console.error("ERRO AO CADASTRAR:", error.response?.data || error.message);
        const msgErro = error.response?.data?.message || "Erro ao conectar com o servidor";

        return res.render("usuarios/cadastro", {
            title: "Cadastrar Usuário",
            message: "Erro: " + msgErro
        });
    }
};