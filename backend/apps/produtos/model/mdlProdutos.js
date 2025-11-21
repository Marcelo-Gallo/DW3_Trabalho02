const db = require("../../../database/databaseconfig");



const getAllProdutos = async () => {
  return (
    await db.query(
      "SELECT * FROM produto WHERE removido = false ORDER BY produtoid ASC"
    )
  ).rows;
};

const getProdutoByID = async (produtoid) => {
  return (
    await db.query(
      "SELECT * FROM produto WHERE produtoid = $1 AND removido = false",
      [produtoid]
    )
  ).rows;
};

const insertProduto = async (produto) => {
  const { nome, descricao, codigobarras } = produto;
  return (
    await db.query(
      "INSERT INTO produto (nome, descricao, codigobarras, removido) VALUES ($1, $2, $3, false) RETURNING *",
      [nome, descricao, codigobarras]
    )
  ).rows;
};

const updateProduto = async (produto) => {
  const { produtoid, nome, descricao, codigobarras } = produto;
  return (
    await db.query(
      "UPDATE produto SET nome = $1, descricao = $2, codigobarras = $3 " +
      "WHERE produtoid = $4 RETURNING *",
      [nome, descricao, codigobarras, produtoid]
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