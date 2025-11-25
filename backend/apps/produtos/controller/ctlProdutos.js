const mdlProdutos = require("../model/mdlProdutos");



const getAllProdutos = async (req, res) => {
  try {
    const produtos = await mdlProdutos.getAllProdutos();
    res.json({ status: "ok", registro: produtos });
  } catch (error) {
    res.status(500).json({ status: "erro", message: error.message });
  }
};

const getProdutoByID = async (req, res) => {
  try {
    const { produtoid } = req.body;
    const produto = await mdlProdutos.getProdutoByID(produtoid);
    res.json({ status: "ok", registro: produto });
  } catch (error) {
    res.status(500).json({ status: "erro", message: error.message });
  }
};

const insertProduto = async (req, res) => {
  try {
    const produto = req.body;
    const novoProduto = await mdlProdutos.insertProduto(produto);
    res.status(201).json({ status: "ok", registro: novoProduto[0] });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ status: "erro", message: "Já existe um produto cadastrado com esse Código de Barras!" });
    }
    res.status(500).json({ status: "erro", message: error.message });
  }
};

const updateProduto = async (req, res) => {
  try {
    const produto = req.body;
    const produtoAtualizado = await mdlProdutos.updateProduto(produto);
    res.json({ status: "ok", registro: produtoAtualizado[0] });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ status: "erro", message: "Este Código de Barras já pertence a outro produto!" });
    }
    res.status(500).json({ status: "erro", message: error.message });
  }
};

const deleteProduto = async (req, res) => {
  try {
    const { produtoid } = req.body;
    const produtoRemovido = await mdlProdutos.deleteProduto(produtoid);
    res.json({ status: "ok", registro: produtoRemovido[0] });
  } catch (error) {
    res.status(500).json({ status: "erro", message: error.message });
  }
};

module.exports = {
  getAllProdutos,
  getProdutoByID,
  insertProduto,
  updateProduto,
  deleteProduto,
};