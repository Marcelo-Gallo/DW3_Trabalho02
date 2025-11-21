const axios = require('axios');

// LISTA
const getAllProdutos = async (req, res) => {
    const token = req.session.token;
    const userName = req.session.userName;

    try {
        const resp = await axios.post(
            process.env.SERVIDOR_DW3 + "/getAllProdutos",
            {},
            { headers: { Authorization: "Bearer " + token } }
        );

        res.render("produtos/manutProdutos", {
            title: "Manutenção de Produtos",
            data: resp.data.registro || [],
            userName,
            message: null
        });

    } catch (error) {
        console.error("Erro ao buscar produtos:", error.message);
        res.render("produtos/manutProdutos", {
            title: "Manutenção de Produtos",
            data: [],
            userName,
            message: "Erro ao carregar produtos."
        });
    }
};

// GET BY ID (Para Edição)
const getProdutoByID = async (req, res) => {
    const token = req.session.token;
    const userName = req.session.userName;
    const id = req.params.id;

    try {
        const resp = await axios.post(
            process.env.SERVIDOR_DW3 + "/getProdutoByID",
            { produtoid: id },
            { headers: { Authorization: "Bearer " + token } }
        );

        res.render("produtos/viewProdutos", {
            title: "Alteração de Produto",
            data: resp.data.registro ? resp.data.registro[0] : {},
            userName,
            message: null
        });

    } catch (error) {
        console.error("Erro ao buscar produto:", error.message);
        res.render("produtos/viewProdutos", {
            title: "Alteração de Produto",
            data: {},
            userName,
            message: "Erro ao carregar produto."
        });
    }
};

// INSERT
const insertProduto = async (req, res) => {
    const token = req.session.token;

    const dados = {
        nome: req.body.nome,
        descricao: req.body.descricao,
        codigobarras: req.body.codigobarras
    };

    try {
        await axios.post(
            process.env.SERVIDOR_DW3 + "/insertProduto",
            dados,
            { headers: { Authorization: "Bearer " + token } }
        );

        res.redirect("/produtos");

    } catch (error) {
        console.error("Erro ao inserir produto:", error.message);
        res.render("produtos/viewProdutos", {
            title: "Cadastro de Produto",
            data: dados,
            message: "Não foi possível inserir o produto."
        });
    }
};

// UPDATE
const updateProduto = async (req, res) => {
    const token = req.session.token;

    const dados = {
        produtoid: req.body.produtoid,
        nome: req.body.nome,
        descricao: req.body.descricao,
        codigobarras: req.body.codigobarras
    };

    try {
        await axios.post(
            process.env.SERVIDOR_DW3 + "/updateProduto",
            dados,
            { headers: { Authorization: "Bearer " + token } }
        );

        res.redirect("/produtos");

    } catch (error) {
        console.error("Erro ao atualizar produto:", error.message);
        res.render("produtos/viewProdutos", {
            title: "Alteração de Produto",
            data: dados,
            message: "Não foi possível atualizar o produto."
        });
    }
};

// DELETE
const deleteProduto = async (req, res) => {
    const token = req.session.token;
    const id = req.params.id;

    try {
        await axios.post(
            process.env.SERVIDOR_DW3 + "/deleteProduto",
            { produtoid: id },
            { headers: { Authorization: "Bearer " + token } }
        );

        res.redirect("/produtos");

    } catch (error) {
        console.error("Erro ao deletar produto:", error.message);
        res.redirect("/produtos");
    }
};

module.exports = {
    getAllProdutos,
    getProdutoByID,
    insertProduto,
    updateProduto,
    deleteProduto
};