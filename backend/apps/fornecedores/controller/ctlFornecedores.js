const mdlFornecedores = require('../model/mdlFornecedores');

// LISTA
const getAllFornecedores = async (req, res) => {
    try {
        const fornecedores = await mdlFornecedores.getAllFornecedores();
        res.json({ status: "ok", registro: fornecedores });
    } catch (error) {
        res.status(500).json({ status: "erro", message: error.message });
    }
};

// GET BY ID 
const getFornecedorByID = async (req, res) => {
    try {
        const { fornecedorid } = req.body;

        if (!fornecedorid) {
            return res.status(400).json({ status: "erro", message: "fornecedorid não informado" });
        }

        const fornecedor = await mdlFornecedores.getFornecedorByID(fornecedorid);
        res.json({ status: "ok", registro: fornecedor });

    } catch (error) {
        res.status(500).json({ status: "erro", message: error.message });
    }
};

// INSERT
const insertFornecedor = async (req, res) => {
    try {
        const fornecedor = req.body;
        const novoFornecedor = await mdlFornecedores.insertFornecedor(fornecedor);
        res.status(201).json({ status: "ok", registro: novoFornecedor[0] });
    } catch (error) {
        res.status(500).json({ status: "erro", message: error.message });
    }
};

// UPDATE
const updateFornecedor = async (req, res) => {
    try {
        const fornecedor = req.body;
        const fornecedorAtualizado = await mdlFornecedores.updateFornecedor(fornecedor);
        res.status(200).json({ status: "ok", registro: fornecedorAtualizado[0] });
    } catch (error) {
        res.status(500).json({ status: "erro", message: error.message });
    }
};

// DELETE
const deleteFornecedor = async (req, res) => {
    try {
        const { fornecedorid } = req.body;

        if (!fornecedorid) {
            return res.status(400).json({ status: "erro", message: "fornecedorid não informado" });
        }

        const resp = await mdlFornecedores.deleteFornecedor(fornecedorid);
        res.status(200).json({ status: "ok", registro: resp[0] });

    } catch (error) {
        res.status(500).json({ status: "erro", message: error.message });
    }
};

module.exports = {
    getAllFornecedores,
    getFornecedorByID,
    insertFornecedor,
    updateFornecedor,
    deleteFornecedor    
};
