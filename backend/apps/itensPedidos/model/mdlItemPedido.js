const db = require("../../../database/databaseconfig");



const getAllItensPedido = async () => {
  return (
    await db.query(
      "SELECT * FROM itempedido WHERE removido = false ORDER BY itempedidoid ASC"
    )
  ).rows;
};

const getItemPedidoByID = async (itempedidoid) => {
  return (
    await db.query(
      "SELECT * FROM itempedido WHERE itempedidoid = $1 AND removido = false",
      [itempedidoid]
    )
  ).rows;
};

const insertItemPedido = async (itemPedidoReg) => {
  const { pedidocompraid, produtoid, quantidade, valorunitario } = itemPedidoReg;
  return (
    await db.query(
      "INSERT INTO itempedido (pedidocompraid, produtoid, quantidade, valorunitario, removido) " +
      "VALUES ($1, $2, $3, $4, false) RETURNING *",
      [pedidocompraid, produtoid, quantidade, valorunitario]
    )
  ).rows;
};

const updateItemPedido = async (itemPedidoReg) => {
  const { itempedidoid, pedidocompraid, produtoid, quantidade, valorunitario } = itemPedidoReg;
  return (
    await db.query(
      "UPDATE itempedido SET pedidocompraid = $1, produtoid = $2, quantidade = $3, valorunitario = $4 " +
      "WHERE itempedidoid = $5 RETURNING *",
      [pedidocompraid, produtoid, quantidade, valorunitario, itempedidoid]
    )
  ).rows;
};

const deleteItemPedido = async (itempedidoid) => {
  return (
    await db.query(
      "UPDATE itempedido SET removido = true WHERE itempedidoid = $1 RETURNING *",
      [itempedidoid]
    )
  ).rows;
};

module.exports = {
  getAllItensPedido,
  getItemPedidoByID,
  insertItemPedido,
  updateItemPedido,
  deleteItemPedido,
};