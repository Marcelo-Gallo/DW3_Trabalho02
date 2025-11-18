const db = require('../../../database/databaseconfig');



const getAllFornecedores = async () => {
  return (
    await db.query("SELECT * FROM fornecedor WHERE removido = false ORDER BY fornecedorid ASC")
  ).rows;
};

const getFornecedorByID = async (fornecedorid) => {
  return (
    await db.query("SELECT * FROM fornecedor WHERE fornecedorid = $1 AND removido = false", [
      fornecedorid,
    ])
  ).rows;
};

const insertFornecedor = async (fornecedor) => {
  const { nomefantasia, razaosocial, cnpj } = fornecedor;
  return (
    await db.query(
      "INSERT INTO fornecedor (nomefantasia, razaosocial, cnpj, removido) " +
      "VALUES ($1, $2, $3, false) RETURNING *",
      [nomefantasia, razaosocial, cnpj]
    )
  ).rows;
};

const updateFornecedor = async (fornecedor) => {
  const { fornecedorid, nomefantasia, razaosocial, cnpj } = fornecedor;
  return (
    await db.query(
      "UPDATE fornecedor SET nomefantasia = $1, razaosocial = $2, cnpj = $3 " +
      "WHERE fornecedorid = $4 RETURNING *",
      [nomefantasia, razaosocial, cnpj, fornecedorid]
    )
  ).rows;
};

const deleteFornecedor = async (fornecedorid) => {
  return (
    await db.query(
      "UPDATE fornecedor SET removido = true WHERE fornecedorid = $1 RETURNING *",
      [fornecedorid]
    )
  ).rows;
};

module.exports = {
  getAllFornecedores,
  getFornecedorByID,
  insertFornecedor,
  updateFornecedor,
  deleteFornecedor,
};