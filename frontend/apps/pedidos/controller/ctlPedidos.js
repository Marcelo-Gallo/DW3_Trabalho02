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
            message: null,
            moment: moment
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


// ABRIR FORMULÁRIO (Novo Pedido)
const abrirFormularioInsert = async (req, res) => {
    const token = req.session.token;
    const userName = req.session.userName;

    try {
        // Busca Produtos para preencher o <select> da tabela de itens
        const respProdutos = await axios.post(
            process.env.SERVIDOR_DW3 + "/getAllProdutos",
            {},
            { headers: { Authorization: "Bearer " + token } }
        );

        res.render("pedidos/viewPedidos", {
            title: "Cadastro de Pedido",
            data: null,
            produtos: respProdutos.data.registro || [],
            userName,
            message: null,
            moment: moment
        });
    } catch (error) {
        console.error("Erro ao carregar formulário:", error.message);
        res.redirect("/pedidos");
    }
};


// GET BY ID (Para Edição)
const getPedidoByID = async (req, res) => {
    const token = req.session.token;
    const userName = req.session.userName;
    const id = req.params.id;

    try {
        // Busca os dados do pedido
        const respPedido = await axios.post(
            process.env.SERVIDOR_DW3 + "/getPedidoByID",
            { pedidocompraid: id },
            { headers: { Authorization: "Bearer " + token } }
        );

        // Busca produtos para o drowpdown
        const respProdutos = await axios.post(
            process.env.SERVIDOR_DW3 + "/getAllProdutos",
            {},
            { headers: { Authorization: "Bearer " + token } }
        );

        // busca produtos de um pedido
        const respItens = await axios.post(
            process.env.SERVIDOR_DW3 + "/getAllItensPedido",
            {},
            { headers: { Authorization: "Bearer " + token } }
        );

        // junta nome do produto com os itens do pedido
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
        console.error("Erro ao buscar pedido:", error.message);
        res.redirect("/pedidos");
    }
};


// INSERT
const insertPedido = async (req, res) => {
    const token = req.session.token;

    try {
        // NORMATIZAÇÃO DE ARRAYS (Culpa do HTML)
        let produtosIDs = req.body.produtoid;
        if (!Array.isArray(produtosIDs)) produtosIDs = [produtosIDs];

        let quantidades = req.body.quantidade;
        if (!Array.isArray(quantidades)) quantidades = [quantidades];

        // PRÉ-CÁLCULO E BUSCA DE PREÇOS
        let totalCalculado = 0;
        let itensParaSalvar = []; // Guarda os dados prontos para salvar

        console.log("[Debug] Iniciando processamento de itens...");

        for (let i = 0; i < produtosIDs.length; i++) {
            if (!produtosIDs[i]) continue; // Pula se o ID for vazio

            const respProd = await axios.post(
                process.env.SERVIDOR_DW3 + "/getProdutoByID",
                { produtoid: produtosIDs[i] },
                { headers: { Authorization: "Bearer " + token } }
            );

            const produtoInfo = respProd.data.registro[0];
            const precoBanco = parseFloat(produtoInfo.valorProduto || produtoInfo.valorproduto || 0);
            console.log(`[DEBUG] Prod ID: ${produtosIDs[i]} | Preço Encontrado: ${precoBanco}`);
            const qtd = parseFloat(quantidades[i]);

            console.log(`[Debug] Item ${i}: ID=${produtosIDs[i]}, Qtd=${qtd}, PreçoBanco=${precoBanco}`);

            // Calcula
            totalCalculado += (qtd * precoBanco);

            itensParaSalvar.push({
                produtoid: produtosIDs[i],
                quantidade: qtd,
                valorunitario: precoBanco
            });
        }

        // SALVA O CABEÇALHO
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

        if (respPedido.data.status !== "ok") {
            throw new Error("Erro ao salvar cabeçalho");
        }

        const novoPedidoId = respPedido.data.registro.pedidocompraid;

        // SALVA OS ITENS
        for (const item of itensParaSalvar) {
            await axios.post(
                process.env.SERVIDOR_DW3 + "/insertItemPedido",
                {
                    pedidocompraid: novoPedidoId,
                    produtoid: item.produtoid,
                    quantidade: item.quantidade,
                    valorunitario: item.valorunitario
                },
                { headers: { Authorization: "Bearer " + token } }
            );
        }

        res.redirect("/pedidos");
    } catch (error) {
        console.error("Erro ao inserir pedido:", error.message);
        res.redirect("/pedidos/novo");
    }
};


// UPDATE
const updatePedido = async (req, res) => {
    const token = req.session.token;
    const id = req.body.pedidocompraid; // ID do pedido sendo editado

    try {
        const dados = {
            pedidocompraid: id,
            numero: req.body.numero,
            datapedido: req.body.datapedido,
            valortotal: 0 // inicia como zero pra calcular em seguida
        };

        // transforma em arrays
        let produtosIDs = req.body.produtoid;
        if (!Array.isArray(produtosIDs)) produtosIDs = [produtosIDs];

        let quantidades = req.body.quantidade;
        if (!Array.isArray(quantidades)) quantidades = [quantidades];

        let totalCalculado = 0;
        let itensParaSalvar = [];

        for (let i = 0; i < produtosIDs.length; i++) {
            if (!produtosIDs[i]) continue; // caso usuário deixe um dos itens do meio vazio, para não quebrar o loop

            // Busca preço atualizado
            const respProd = await axios.post(
                process.env.SERVIDOR_DW3 + "/getProdutoByID",
                { produtoid: produtosIDs[i] },
                { headers: { Authorization: "Bearer " + token } }
            );

            const prodData = respProd.data.registro[0];
            const preco = parseFloat(prodData.valorProduto || prodData.valorproduto || 0);
            const qtd = parseFloat(quantidades[i]);

            totalCalculado += (qtd * preco);
            itensParaSalvar.push({ produtoid: produtosIDs[i], quantidade: qtd, valorunitario: preco });
        }

        dados.valortotal = totalCalculado;

        // chama api update
        await axios.post(
            process.env.SERVIDOR_DW3 + "/updatePedido",
            dados,
            { headers: { Authorization: "Bearer " + token } }
        );

        // remove todos os antigos primeiro
        await axios.post(
            process.env.SERVIDOR_DW3 + "/deleteItensByPedidoID",
            { pedidocompraid: id },
            { headers: { Authorization: "Bearer " + token } }
        );

        // insere os novos
        for (const item of itensParaSalvar) {
            await axios.post(
                process.env.SERVIDOR_DW3 + "/insertItemPedido",
                {
                    pedidocompraid: id,
                    produtoid: item.produtoid,
                    quantidade: item.quantidade,
                    valorunitario: item.valorunitario
                },
                { headers: { Authorization: "Bearer " + token } }
            );
        }

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


// --- FUNÇÕES EXTRAS DE ITENS (Mantidas para compatibilidade) ---
// Se você ainda usar a tela separada de itens, mantenha.
// Se for usar SÓ a tela unificada, pode remover.
// Mantivemos para segurança.

const itensView = async (req, res) => {
    // ... (código igual ao anterior)
    res.redirect('/pedidos'); // Placeholder se não for usar
};

const insertItem = async (req, res) => {
    // ...
    res.redirect('/pedidos');
};

const deleteItem = async (req, res) => {
    // ...
    res.redirect('/pedidos');
};

module.exports = {
    getAllPedidos,
    abrirFormularioInsert,
    getPedidoByID,
    insertPedido,
    updatePedido,
    deletePedido,
    itensView,
    insertItem,
    deleteItem
};
