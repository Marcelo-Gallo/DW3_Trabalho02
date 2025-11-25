const axios = require('axios');
const moment = require('moment');

// LISTA (R - Read)
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
            isAdmin: req.session.isAdmin,
            message: null,
            moment: moment
        });

    } catch (error) {
        console.error("[GetAll] Erro:", error.message);
        res.render("pedidos/manutPedidos", {
            title: "Manutenção de Pedidos",
            data: [],
            userName,
            message: "Erro ao carregar pedidos.",
            moment: moment
        });
    }
};

// ABRIR FORMULÁRIO (Novo Pedido)
const abrirFormularioInsert = async (req, res) => {
    const token = req.session.token;
    const userName = req.session.userName;

    try {
        const respProdutos = await axios.post(
            process.env.SERVIDOR_DW3 + "/getAllProdutos",
            {},
            { headers: { Authorization: "Bearer " + token } }
        );

        res.render("pedidos/viewPedidos", {
            title: "Cadastro de Pedido",
            data: null,
            produtos: respProdutos.data.registro || [],
            itens: [],
            userName,
            message: null,
            moment: moment
        });

    } catch (error) {
        console.error("[FormInsert] Erro:", error.message);
        res.redirect("/pedidos");
    }
};

// GET BY ID (Abrir Edição)
const getPedidoByID = async (req, res) => {
    const token = req.session.token;
    const userName = req.session.userName;
    const id = req.params.id;

    try {
        // Busca Pedido
        const respPedido = await axios.post(
            process.env.SERVIDOR_DW3 + "/getPedidoByID",
            { pedidocompraid: id },
            { headers: { Authorization: "Bearer " + token } }
        );

        // Busca Produtos
        const respProdutos = await axios.post(
            process.env.SERVIDOR_DW3 + "/getAllProdutos",
            {},
            { headers: { Authorization: "Bearer " + token } }
        );

        // Busca Itens
        const respItens = await axios.post(
            process.env.SERVIDOR_DW3 + "/getAllItensPedido",
            {}, 
            { headers: { Authorization: "Bearer " + token } }
        );

        // Filtra itens deste pedido
        const itensDoPedido = (respItens.data.registro || []).filter(i => i.pedidocompraid == id);

        res.render("pedidos/viewPedidos", {
            title: "Alteração de Pedido",
            data: respPedido.data.registro ? respPedido.data.registro[0] : {},
            produtos: respProdutos.data.registro || [],
            itens: itensDoPedido,
            userName,
            message: null,
            moment: moment
        });

    } catch (error) {
        console.error("[GetByID] Erro:", error.message);
        res.redirect("/pedidos");
    }
};

const insertPedido = async (req, res) => {
    const token = req.session.token;

    try {
        console.log("[INSERT START] Iniciando inserção...");

        let produtosIDs = req.body.produtoid;
        if (!produtosIDs) produtosIDs = []; 
        if (!Array.isArray(produtosIDs)) produtosIDs = [produtosIDs];

        let quantidades = req.body.quantidade;
        if (!quantidades) quantidades = [];
        if (!Array.isArray(quantidades)) quantidades = [quantidades];

        console.log("[INSERT] Itens brutos:", produtosIDs.length);

        let totalCalculado = 0;
        let itensParaSalvar = [];

        for (let i = 0; i < produtosIDs.length; i++) {
            if (!produtosIDs[i]) continue;

            const respProd = await axios.post(process.env.SERVIDOR_DW3 + "/getProdutoByID",
                { produtoid: produtosIDs[i] },
                { headers: { Authorization: "Bearer " + token } }
            );

            const produtoInfo = respProd.data.registro[0];
            const precoBanco = parseFloat(produtoInfo.valorProduto || produtoInfo.valorproduto || 0);
            const qtd = parseFloat(quantidades[i]);

            totalCalculado += (qtd * precoBanco);

            console.log(`[INSERT ITEM] Prod: ${produtosIDs[i]} | Qtd: ${qtd} | Preço: ${precoBanco}`);

            itensParaSalvar.push({
                produtoid: produtosIDs[i],
                quantidade: qtd,
                valorunitario: precoBanco
            });
        }

        console.log("[INSERT] Total Calculado:", totalCalculado);

        const dadosHeader = {
            numero: req.body.numero,
            datapedido: req.body.datapedido,
            valortotal: totalCalculado
        };

        const respPedido = await axios.post(
            process.env.SERVIDOR_DW3 + "/insertPedido",
            dadosHeader,
            { headers: { Authorization: "Bearer " + token } }
        );

        if (respPedido.data.status !== "ok") throw new Error("Erro ao salvar cabeçalho: " + respPedido.data.message);

        const novoPedidoId = respPedido.data.registro.pedidocompraid;

        for (const item of itensParaSalvar) {
            await axios.post(process.env.SERVIDOR_DW3 + "/insertItemPedido", {
                pedidocompraid: novoPedidoId,
                produtoid: item.produtoid,
                quantidade: item.quantidade,
                valorunitario: item.valorunitario
            }, { headers: { Authorization: "Bearer " + token } });
        }

        res.redirect("/pedidos");

    } catch (error) {
        console.error("[INSERT ERROR]", error.message);
        const msg = error.response?.data?.message || error.message || "Erro ao processar o pedido.";

        let listaProdutos = [];
        try {
            const respProdutos = await axios.post(
                process.env.SERVIDOR_DW3 + "/getAllProdutos",
                {},
                { headers: { Authorization: "Bearer " + token } }
            );
            listaProdutos = respProdutos.data.registro || [];
        } catch (e) { console.error("Erro ao recuperar produtos no fallback"); }

        res.render("pedidos/viewPedidos", {
            title: "Cadastro de Pedido",
            data: req.body,
            produtos: listaProdutos,
            itens: [],
            userName: req.session.userName,
            message: msg,
            moment: require('moment')
        });
    }
};

const updatePedido = async (req, res) => {
    const token = req.session.token;
    const id = req.body.pedidocompraid;

    try {
        console.log("[UPDATE START] Editando Pedido ID:", id);

        let produtosIDs = req.body.produtoid;
        if (!produtosIDs) produtosIDs = [];
        if (!Array.isArray(produtosIDs)) produtosIDs = [produtosIDs];

        let quantidades = req.body.quantidade;
        if (!quantidades) quantidades = [];
        if (!Array.isArray(quantidades)) quantidades = [quantidades];

        let totalCalculado = 0;
        let itensParaSalvar = [];

        for (let i = 0; i < produtosIDs.length; i++) {
            if (!produtosIDs[i]) continue;

            const respProd = await axios.post(process.env.SERVIDOR_DW3 + "/getProdutoByID",
                { produtoid: produtosIDs[i] }, { headers: { Authorization: "Bearer " + token } });

            const produtoInfo = respProd.data.registro[0];
            const preco = parseFloat(produtoInfo.valorProduto || produtoInfo.valorproduto || 0);
            const qtd = parseFloat(quantidades[i]);

            totalCalculado += (qtd * preco);
            
            console.log(`[UPDATE ITEM] Prod: ${produtosIDs[i]} | Qtd: ${qtd} | Preço Atualizado: ${preco}`);

            itensParaSalvar.push({ 
                produtoid: produtosIDs[i], 
                quantidade: qtd, 
                valorunitario: preco 
            });
        }

        console.log("[UPDATE] Novo Total:", totalCalculado);

        const dadosHeader = {
            pedidocompraid: id,
            numero: req.body.numero,
            datapedido: req.body.datapedido,
            valortotal: totalCalculado
        };

        await axios.post(
            process.env.SERVIDOR_DW3 + "/updatePedido",
            dadosHeader,
            { headers: { Authorization: "Bearer " + token } }
        );

        await axios.post(process.env.SERVIDOR_DW3 + "/deleteItensByPedidoID",
            { pedidocompraid: id }, { headers: { Authorization: "Bearer " + token } });

        for (const item of itensParaSalvar) {
            await axios.post(process.env.SERVIDOR_DW3 + "/insertItemPedido", {
                pedidocompraid: id,
                produtoid: item.produtoid,
                quantidade: item.quantidade,
                valorunitario: item.valorunitario
            }, { headers: { Authorization: "Bearer " + token } });
        }

        res.redirect("/pedidos");

    } catch (error) {
        console.error("[UPDATE ERROR]", error.message);
        const msg = error.response?.data?.message || error.message || "Erro ao atualizar o pedido.";

        let listaProdutos = [];
        try {
            const respProdutos = await axios.post(
                process.env.SERVIDOR_DW3 + "/getAllProdutos",
                {},
                { headers: { Authorization: "Bearer " + token } }
            );
            listaProdutos = respProdutos.data.registro || [];
        } catch (e) { console.error("Erro ao recuperar produtos no fallback"); }
        
        res.render("pedidos/viewPedidos", {
            title: "Alteração de Pedido",
            data: req.body,
            produtos: listaProdutos,
            itens: [], 
            userName: req.session.userName,
            message: msg,
            moment: require('moment')
        });
    }
};

// DELETE
const deletePedido = async (req, res) => {
    const token = req.session.token;
    const id = req.params.id;

    try {
        // Apaga itens primeiro
        await axios.post(
            process.env.SERVIDOR_DW3 + "/deleteItensByPedidoID",
            { pedidocompraid: id },
            { headers: { Authorization: "Bearer " + token } }
        );

        await axios.post(
            process.env.SERVIDOR_DW3 + "/deletePedido",
            { pedidocompraid: id },
            { headers: { Authorization: "Bearer " + token } }
        );

        res.redirect("/pedidos");

    } catch (error) {
        console.error("[DELETE ERROR]", error.message);
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