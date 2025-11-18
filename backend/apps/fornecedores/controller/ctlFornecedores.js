const mdlFornecedores = require('../model/mdlFornecedores');

const getAllFornecedores = async (req, res) => {
    try {
        const fornecedores = await mdlFornecedores.getAllFornecedores();
        res.json({ status: "ok", registro: fornecedores });
    } catch (error) {
        res.status(500).json({ status: "erro", message: error.message });
    }
};

const getFornecedorByID = async (req, res) => {
    try {
        const fornecedor = await mdlFornecedores.getFornecedorByID(fornecedorid);
        res.json({ status: "ok", registro: fornecedor });
    } catch (error) {
        res.status(500).json({ status: "erro", message: error.message });
    }
};

const insertFornecedor = async (req, res) => {
    try {
        const fornecedor = req.body; // pega o forncedor da requisição
        const novoFornecedor = await mdlFornecedores.insertFornecedor(fornecedor);
        res.status(201).json({ status: "ok", registro: novoFornecedor[0]});
    } catch (error) {
        res.status(500).json({ status: "erro", message: error.message });
    }
};

const updateFornecedor = async (req, res) => {
    try {
        const fornecedor = req.body;
        const fornecedorAtualizado = await mdlFornecedores.updateFornecedor(fornecedor);
        res.status(201).json({ status: "ok", registro: fornecedorAtualizado[0]});
    } catch (error) {
        res.status(500).json({ status: "erro", message: error.message})
    }
};

const deleteFornecedor = async (req, res) => {
    try{
        const fornecedor = req.body;
        const fornecedorDeletado = await mdlFornecedores.deleteFornecedor(fornecedor);
        res.status(201).json({ status: "ok", registro: fornecedorDeletado[0]});
    } catch (error) {
        res.status(500).json({ status: "erro", message: error.message})
    }
}

module.exports = {
    getAllFornecedores,
    getFornecedorByID,
    insertFornecedor,
    updateFornecedor,
    deleteFornecedor    
}