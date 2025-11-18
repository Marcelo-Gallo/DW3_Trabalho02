const db = require('../../../database/databaseconfig');

// -- LOGIN
const GetCredencial = async (loginPar) => {
    return (
        await db.query(
            'select username, password from usuarios where username = $1 and deleted = false',
            [loginPar]
        )
    ).rows //retorna as rows com o resultado da consulta
}

// -- CADASTRO
const InsertUsuario = async (username, hashedPassword) => {
  return (
    await db.query(
      "INSERT INTO usuarios (username, password, deleted) " +
      "VALUES ($1, $2, false) returning *",
      [username, hashedPassword] //dados usados na query no lugar dos $1 e $2
    )
  ).rows;
};

module.exports = {
  GetCredencial,
  InsertUsuario,
};