const db = require("../../../database/databaseconfig");

const getAllProdutos = async () => {
  return (
    await db.query(
      "SELECT p.*, f.nomefantasia, f.removido AS fornecedor_removido " + 
      "FROM produto p " +
      "LEFT JOIN fornecedor f ON p.fornecedorid = f.fornecedorid " +
      "WHERE p.removido = false ORDER BY p.produtoid ASC"
    )
  ).rows;
};

const getProdutoByID = async (produtoid) => {
  return (
    await db.query(
      "SELECT p.*, f.nomefantasia AS fornecedor_nome, f.removido AS fornecedor_removido " +
      "FROM produto p " +
      "LEFT JOIN fornecedor f ON p.fornecedorid = f.fornecedorid " +
      "WHERE p.produtoid = $1 AND p.removido = false",
      [produtoid]
    )
  ).rows;
};

const insertProduto = async (produto) => {
  const { nome, descricao, codigobarras, valorProduto, fornecedorid } = produto;
  
  return (
    await db.query(
      "INSERT INTO produto (nome, descricao, codigobarras, valorProduto, fornecedorid, removido) " +
      "VALUES ($1, $2, $3, $4, $5, false) RETURNING *",
      [nome, descricao, codigobarras, valorProduto, fornecedorid]
    )
  ).rows;
};

const updateProduto = async (produto) => {
  const { produtoid, nome, descricao, codigobarras, valorProduto, fornecedorid } = produto;
  
  return (
    await db.query(
      "UPDATE produto SET nome = $1, descricao = $2, codigobarras = $3, " +
      "valorProduto = $4, fornecedorid = $5 " +
      "WHERE produtoid = $6 RETURNING *",
      [nome, descricao, codigobarras, valorProduto, fornecedorid, produtoid]
    )
  ).rows;
};

const deleteProduto = async (produtoid) => {
  return (
    await db.query(
      "UPDATE produto SET removido = true WHERE produtoid = $1 RETURNING *",
      [produtoid]
    )
  ).rows;
};

module.exports = {
  getAllProdutos,
  getProdutoByID,
  insertProduto,
  updateProduto,
  deleteProduto,
};