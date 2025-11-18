const db = require("../../../database/databaseconfig");

const getAllPedidos = async () => {
  return (
    await db.query(
      "SELECT p.*, f.nomefantasia FROM pedidocompra p " +
      "INNER JOIN fornecedor f ON p.fornecedorid = f.fornecedorid " +
      "WHERE p.removido = false ORDER BY p.pedidocompraid ASC"
    )
  ).rows;
};

const getPedidoByID = async (pedidocompraid) => {
  return (
    await db.query(
      "SELECT * FROM pedidocompra WHERE pedidocompraid = $1 AND removido = false",
      [pedidocompraid]
    )
  ).rows;
};

const insertPedido = async (pedido) => {
  // Relacionamento 1:N (Precisa do fornecedorid)
  const { numero, datapedido, valortotal, fornecedorid } = pedido;
  return (
    await db.query(
      "INSERT INTO pedidocompra (numero, datapedido, valortotal, fornecedorid, removido) " +
      "VALUES ($1, $2, $3, $4, false) RETURNING *",
      [numero, datapedido, valortotal, fornecedorid]
    )
  ).rows;
};

const updatePedido = async (pedido) => {
  const { pedidocompraid, numero, datapedido, valortotal, fornecedorid } = pedido;
  return (
    await db.query(
      "UPDATE pedidocompra SET numero = $1, datapedido = $2, valortotal = $3, fornecedorid = $4 " +
      "WHERE pedidocompraid = $5 RETURNING *",
      [numero, datapedido, valortotal, fornecedorid, pedidocompraid]
    )
  ).rows;
};

const deletePedido = async (pedidocompraid) => {
  return (
    await db.query(
      "UPDATE pedidocompra SET removido = true WHERE pedidocompraid = $1 RETURNING *",
      [pedidocompraid]
    )
  ).rows;
};

module.exports = {
  getAllPedidos,
  getPedidoByID,
  insertPedido,
  updatePedido,
  deletePedido,
};