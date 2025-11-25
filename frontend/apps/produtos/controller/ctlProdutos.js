const axios = require('axios');

// Read
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
            isAdmin: req.session.isAdmin,
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


// Busca os fornecedores para preencher o <select> antes de abrir a tela
const openProdutoInsert = async (req, res) => {
    const token = req.session.token;
    const userName = req.session.userName;

    try {
        // Busca a lista de fornecedores na API
        const respFornecedores = await axios.post(
            process.env.SERVIDOR_DW3 + "/getAllFornecedores",
            {},
            { headers: { Authorization: "Bearer " + token } }
        );

        res.render("produtos/viewProdutos", {
            title: "Cadastro de Produto",
            data: {}, // Dados vazios
            fornecedores: respFornecedores.data.registro || [], // Manda a lista pra view
            userName,
            message: null
        });

    } catch (error) {
        console.error("Erro ao carregar formulário:", error.message);
        res.redirect("/produtos");
    }
};

// GET BY ID
const getProdutoByID = async (req, res) => {
    const token = req.session.token;
    const userName = req.session.userName;
    const id = req.params.id;

    try {
        // Busca o Produto
        const respProduto = await axios.post(
            process.env.SERVIDOR_DW3 + "/getProdutoByID",
            { produtoid: id },
            { headers: { Authorization: "Bearer " + token } }
        );

        // Busca os Fornecedores
        const respFornecedores = await axios.post(
            process.env.SERVIDOR_DW3 + "/getAllFornecedores",
            {},
            { headers: { Authorization: "Bearer " + token } }
        );

        const produto = respProduto.data.registro ? respProduto.data.registro[0] : {};
        const listaFornecedores = respFornecedores.data.registro || [];

        if (produto.fornecedorid) {
            //arrow function que verifica se o fornecedor do produto está na lista de ativos
            const fornecedorExiste = listaFornecedores.find(f => f.fornecedorid == produto.fornecedorid);
            
            // Se não achou (porque foi excluído), adiciona ele manualmente na lista para exibição
            if (!fornecedorExiste) {
                listaFornecedores.push({
                    fornecedorid: produto.fornecedorid,
                    nomefantasia: produto.fornecedor_nome || "(Fornecedor Desconhecido)",
                    removido: true // Marca para sabermos que é excluído
                });
            }
        }


        res.render("produtos/viewProdutos", {
            title: "Alteração de Produto",
            data: respProduto.data.registro ? respProduto.data.registro[0] : {},
            fornecedores: respFornecedores.data.registro || [], // Manda a lista
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
    const userName = req.session.userName;

    const dados = {
        nome: req.body.nome,
        descricao: req.body.descricao,
        codigobarras: req.body.codigobarras,
        valorProduto: req.body.valorProduto,
        fornecedorid: req.body.fornecedorid,
        valorProduto: req.body.valorProduto.replace(',', '.') //replace é pra ficar em formato com decimal
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

        const msg = error.response?.data?.message || "Não foi possível inserir o produto.";

        let listaFornecedores = [];
        try {
            const respFornecedores = await axios.post(
                process.env.SERVIDOR_DW3 + "/getAllFornecedores",
                {},
                { headers: { Authorization: "Bearer " + token } }
            );
            listaFornecedores = respFornecedores.data.registro || [];
        } catch (err) {
            console.error("Erro ao recuperar fornecedores no fallback:", err.message);
        }

        res.render("produtos/viewProdutos", {
            title: "Cadastro de Produto",
            data: dados, 
            fornecedores: listaFornecedores,
            userName,   
            message: msg
        });
    }
};

// UPDATE
const updateProduto = async (req, res) => {
    const token = req.session.token;
    const userName = req.session.userName;

    const dados = {
        produtoid: req.body.produtoid,
        nome: req.body.nome,
        descricao: req.body.descricao,
        codigobarras: req.body.codigobarras,
        valorProduto: req.body.valorProduto,
        fornecedorid: req.body.fornecedorid
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
        
        const msg = error.response?.data?.message || "Não foi possível atualizar o produto.";

        let listaFornecedores = [];
        try {
            const respFornecedores = await axios.post(
                process.env.SERVIDOR_DW3 + "/getAllFornecedores",
                {},
                { headers: { Authorization: "Bearer " + token } }
            );
            listaFornecedores = respFornecedores.data.registro || [];
        } catch (err) {
            console.error("Erro ao recuperar fornecedores no fallback:", err.message);
        }

        res.render("produtos/viewProdutos", {
            title: "Alteração de Produto",
            data: dados,
            fornecedores: listaFornecedores, // <--- AGORA O DROPDOWN VAI FUNCIONAR
            userName,
            message: msg
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
    openProdutoInsert,
    getProdutoByID,
    insertProduto,
    updateProduto,
    deleteProduto
};