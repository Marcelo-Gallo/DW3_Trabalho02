const axios = require('axios');

// LISTA
const getAllFornecedores = async (req, res) => {
    const token = req.session.token;
    const userName = req.session.userName;

    try {
        console.log("[Front] Tentando buscar fornecedores..."); // LOG 3

        const resp = await axios.post(
            process.env.SERVIDOR_DW3 + "/getAllFornecedores",
            {},
            { headers: { Authorization: "Bearer " + token } }
        );

        console.log("[Front] Resposta da API (Status):", resp.data.status); // LOG 4
        console.log("[Front] Resposta da API (Qtd):", resp.data.registro ? resp.data.registro.length : "Nulo"); // LOG 5

        // --- DEBUG ---
        console.log("USUÁRIO:", userName);
        console.log("É ADMIN?", req.session.isAdmin); 
        // -------------

        res.render("fornecedores/manutFornecedores", {
            title: "Manutenção de Fornecedores",
            data: resp.data.registro || [],
            userName,
            isAdmin: req.session.isAdmin,
            message: null
        });

    } catch (error) {
        console.error("[Front] Erro no Axios:", error.message); // LOG ERRO
        // Se tiver resposta de erro detalhada da API, mostra também
        if (error.response) console.error("[Front] Detalhes:", error.response.data);

        res.render("fornecedores/manutFornecedores", {
            title: "Manutenção de Fornecedores",
            data: [],
            userName,
            message: "Erro ao carregar fornecedores."
        });
    }
};

// GET BY ID
const getFornecedorByID = async (req, res) => {
    const token = req.session.token;
    const userName = req.session.userName;
    const id = req.params.id;

    try {
        const resp = await axios.post(
            process.env.SERVIDOR_DW3 + "/getFornecedorByID",
            { fornecedorid: id },
            { headers: { Authorization: "Bearer " + token } }
        );

        res.render("fornecedores/viewFornecedores", {
            title: "Alteração de Fornecedor",
            data: resp.data.registro ? resp.data.registro[0] : {},
            userName,
            message: null
        });

    } catch (error) {
        console.error("Erro ao buscar fornecedor:", error.message);

        res.render("fornecedores/viewFornecedores", {
            title: "Alteração de Fornecedor",
            data: {},
            userName,
            message: "Erro ao carregar fornecedor."
        });
    }
};

// INSERT
const insertFornecedor = async (req, res) => {
    const token = req.session.token;
    const userName = req.session.userName; // <--- 1. GARANTA QUE ESTÁ DEFINIDO AQUI

    const dados = {
        nomefantasia: req.body.nomefantasia,
        razaosocial: req.body.razaosocial,
        cnpj: req.body.cnpj
    };

    try {
        await axios.post(
            process.env.SERVIDOR_DW3 + "/insertFornecedor",
            dados,
            { headers: { Authorization: "Bearer " + token } }
        );

        res.redirect("/fornecedores");

    } catch (error) {
        console.error("Erro ao inserir fornecedor:", error.message);
        
        // Pega mensagem de erro da API se houver 
        const msg = error.response?.data?.message || "Erro ao cadastrar fornecedor.";

        res.render("fornecedores/viewFornecedores", {
            title: "Cadastro de Fornecedor",
            data: dados,
            userName: userName, 
            message: msg
        });
    }
};

// UPDATE
const updateFornecedor = async (req, res) => {
    const token = req.session.token;
    const userName = req.session.userName;

    const dados = {
        fornecedorid: req.body.fornecedorid,
        nomefantasia: req.body.nomefantasia,
        razaosocial: req.body.razaosocial,
        cnpj: req.body.cnpj
    };

    try {
        await axios.post(
            process.env.SERVIDOR_DW3 + "/updateFornecedor",
            dados,
            { headers: { Authorization: "Bearer " + token } }
        );

        res.redirect("/fornecedores");

    } catch (error) {
        console.error("Erro ao atualizar fornecedor:", error.message);

        const msg = error.response?.data?.message || "Erro ao atualizar fornecedor.";

        res.render("fornecedores/viewFornecedores", {
            title: "Alteração de Fornecedor",
            data: dados,
            userName: userName,
            message: msg
        });
    }
};

// DELETE
const deleteFornecedor = async (req, res) => {
    const token = req.session.token;
    const id = req.params.id;

    try {
        await axios.post(
            process.env.SERVIDOR_DW3 + "/deleteFornecedor",
            { fornecedorid: id },
            { headers: { Authorization: "Bearer " + token } }
        );

        res.redirect("/fornecedores");

    } catch (error) {
        console.error("Erro ao deletar fornecedor:", error.message);
        res.redirect("/fornecedores");
    }
};

module.exports = {
    getAllFornecedores,
    getFornecedorByID,
    insertFornecedor,
    updateFornecedor,
    deleteFornecedor
};
