const mdlItemPedido = require("../model/mdlItemPedido");

const getAllItensPedido = async (req, res) => {
  try {
    const itens = await mdlItemPedido.getAllItensPedido();
    res.json({ status: "ok", registro: itens });
  } catch (error) {
    res.status(500).json({ status: "erro", message: error.message });
  }
};

const getItemPedidoByID = async (req, res) => {
  try {
    const { itempedidoid } = req.body;
    const item = await mdlItemPedido.getItemPedidoByID(itempedidoid);
    res.json({ status: "ok", registro: item });
  } catch (error) {
    res.status(500).json({ status: "erro", message: error.message });
  }
};

const insertItemPedido = async (req, res) => {
  try {
    const itemPedidoReg = req.body;
    const novoItem = await mdlItemPedido.insertItemPedido(itemPedidoReg);
    res.status(201).json({ status: "ok", registro: novoItem[0] });
  } catch (error) {
    res.status(500).json({ status: "erro", message: error.message });
  }
};

const updateItemPedido = async (req, res) => {
  try {
    const itemPedidoReg = req.body;
    const itemAtualizado = await mdlItemPedido.updateItemPedido(itemPedidoReg);
    res.json({ status: "ok", registro: itemAtualizado[0] });
  } catch (error) {
    res.status(500).json({ status: "erro", message: error.message });
  }
};

const deleteItemPedido = async (req, res) => {
  try {
    const { itempedidoid } = req.body;
    const itemRemovido = await mdlItemPedido.deleteItemPedido(itempedidoid);
    res.json({ status: "ok", registro: itemRemovido[0] });
  } catch (error) {
    res.status(500).json({ status: "erro", message: error.message });
  }
};

module.exports = {
  getAllItensPedido,
  getItemPedidoByID,
  insertItemPedido,
  updateItemPedido,
  deleteItemPedido,
};