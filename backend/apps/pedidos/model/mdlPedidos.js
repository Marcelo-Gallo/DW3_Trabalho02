const db = require("../../../database/databaseconfig");

const getAllPedidos = async () => {
  return (
    await db.query(
      "SELECT * FROM pedidocompra WHERE removido = false ORDER BY pedidocompraid ASC"
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
  const { numero, datapedido, valortotal } = pedido;
  return (
    await db.query(
      "INSERT INTO pedidocompra (numero, datapedido, valortotal, removido) " +
      "VALUES ($1, $2, $3, false) RETURNING *",
      [numero, datapedido, valortotal]
    )
  ).rows;
};

const updatePedido = async (pedido) => {
  const { pedidocompraid, numero, datapedido, valortotal } = pedido;
  return (
    await db.query(
      "UPDATE pedidocompra SET numero = $1, datapedido = $2, valortotal = $3 " +
      "WHERE pedidocompraid = $4 RETURNING *",
      [numero, datapedido, valortotal, pedidocompraid]
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