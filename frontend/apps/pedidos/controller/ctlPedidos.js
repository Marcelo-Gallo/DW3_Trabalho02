const axios = require('axios');
const moment = require('moment');

// LISTA
const getAllPedidos = async (req, res) => {
    const token = req.session.token;
    const userName = req.session.userName;

    try {
        const resp = await axios.post(
            process.env.SERVIDOR_DW3 + "/getAllPedidos",
            {},
            { headers: { Authorization: "Bearer " + token } }
        );

        res.render("pedidos/manutPedidos", {
            title: "Manutenção de Pedidos",
            data: resp.data.registro || [],
            userName,
            message: null,
            moment: moment // Passando moment para formatar data na view
        });

    } catch (error) {
        console.error("Erro ao buscar pedidos:", error.message);
        res.render("pedidos/manutPedidos", {
            title: "Manutenção de Pedidos",
            data: [],
            userName,
            message: "Erro ao carregar pedidos.",
            moment: moment
        });
    }
};

// Abre formulário de Cadastro (Busca Fornecedores para o Select)
const abrirFormularioInsert = async (req, res) => {
    const token = req.session.token;
    const userName = req.session.userName;

    try {
        const respFornecedores = await axios.post(
            process.env.SERVIDOR_DW3 + "/getAllFornecedores",
            {},
            { headers: { Authorization: "Bearer " + token } }
        );

        res.render("pedidos/viewPedidos", {
            title: "Cadastro de Pedido",
            data: null,
            fornecedores: respFornecedores.data.registro || [],
            userName,
            message: null,
            moment: moment
        });

    } catch (error) {
        console.error("Erro ao carregar formulário:", error.message);
        res.redirect("/pedidos");
    }
};

// GET BY ID (Busca Pedido E Fornecedores para Edição)
const getPedidoByID = async (req, res) => {
    const token = req.session.token;
    const userName = req.session.userName;
    const id = req.params.id;

    try {
        const respPedido = await axios.post(
            process.env.SERVIDOR_DW3 + "/getPedidoByID",
            { pedidocompraid: id },
            { headers: { Authorization: "Bearer " + token } }
        );

        const respFornecedores = await axios.post(
            process.env.SERVIDOR_DW3 + "/getAllFornecedores",
            {},
            { headers: { Authorization: "Bearer " + token } }
        );

        res.render("pedidos/viewPedidos", {
            title: "Alteração de Pedido",
            data: respPedido.data.registro ? respPedido.data.registro[0] : {},
            fornecedores: respFornecedores.data.registro || [],
            userName,
            message: null,
            moment: moment
        });

    } catch (error) {
        console.error("Erro ao buscar pedido:", error.message);
        res.redirect("/pedidos");
    }
};

// INSERT
const insertPedido = async (req, res) => {
    const token = req.session.token;

    const dados = {
        numero: req.body.numero,
        datapedido: req.body.datapedido,
        valortotal: req.body.valortotal,
        fornecedorid: req.body.fornecedorid
    };

    try {
        await axios.post(
            process.env.SERVIDOR_DW3 + "/insertPedido",
            dados,
            { headers: { Authorization: "Bearer " + token } }
        );

        res.redirect("/pedidos");

    } catch (error) {
        console.error("Erro ao inserir pedido:", error.message);
        res.redirect("/pedidos/novo");
    }
};

// UPDATE
const updatePedido = async (req, res) => {
    const token = req.session.token;

    const dados = {
        pedidocompraid: req.body.pedidocompraid,
        numero: req.body.numero,
        datapedido: req.body.datapedido,
        valortotal: req.body.valortotal,
        fornecedorid: req.body.fornecedorid
    };

    try {
        await axios.post(
            process.env.SERVIDOR_DW3 + "/updatePedido",
            dados,
            { headers: { Authorization: "Bearer " + token } }
        );

        res.redirect("/pedidos");

    } catch (error) {
        console.error("Erro ao atualizar pedido:", error.message);
        res.redirect("/pedidos");
    }
};

// DELETE
const deletePedido = async (req, res) => {
    const token = req.session.token;
    const id = req.params.id;

    try {
        await axios.post(
            process.env.SERVIDOR_DW3 + "/deletePedido",
            { pedidocompraid: id },
            { headers: { Authorization: "Bearer " + token } }
        );

        res.redirect("/pedidos");

    } catch (error) {
        console.error("Erro ao deletar pedido:", error.message);
        res.redirect("/pedidos");
    }
};

module.exports = {
    getAllPedidos,
    abrirFormularioInsert,
    getPedidoByID,
    insertPedido,
    updatePedido,
    deletePedido
};