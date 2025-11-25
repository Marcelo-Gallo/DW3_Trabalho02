const mdlPedidos = require("../model/mdlPedidos");



const getAllPedidos = async (req, res) => {
  try {
    const pedidos = await mdlPedidos.getAllPedidos();
    res.json({ status: "ok", registro: pedidos });
  } catch (error) {
    res.status(500).json({ status: "erro", message: error.message });
  }
};

const getPedidoByID = async (req, res) => {
  try {
    const { pedidocompraid } = req.body;
    const pedido = await mdlPedidos.getPedidoByID(pedidocompraid);
    res.json({ status: "ok", registro: pedido });
  } catch (error) {
    res.status(500).json({ status: "erro", message: error.message });
  }
};

const insertPedido = async (req, res) => {
  try {
    const pedido = req.body;
    const novoPedido = await mdlPedidos.insertPedido(pedido);
    res.status(201).json({ status: "ok", registro: novoPedido[0] });
  } catch (error) {
    if (error.code === '23505') {
        return res.status(400).json({ status: "erro", message: "Já existe um pedido com este Número!" });
    }
    res.status(500).json({ status: "erro", message: error.message });
  }
};

const updatePedido = async (req, res) => {
  try {
    const pedido = req.body;
    const pedidoAtualizado = await mdlPedidos.updatePedido(pedido);
    res.json({ status: "ok", registro: pedidoAtualizado[0] });
  } catch (error) {
    if (error.code === '23505') {
        return res.status(400).json({ status: "erro", message: "Já existe outro pedido com este Número!" });
    }
    res.status(500).json({ status: "erro", message: error.message });
  }
};

const deletePedido = async (req, res) => {
  try {
    const { pedidocompraid } = req.body;
    const pedidoRemovido = await mdlPedidos.deletePedido(pedidocompraid);
    res.json({ status: "ok", registro: pedidoRemovido[0] });
  } catch (error) {
    res.status(500).json({ status: "erro", message: error.message });
  }
};

module.exports = {
  getAllPedidos,
  getPedidoByID,
  insertPedido,
  updatePedido,
  deletePedido,
};