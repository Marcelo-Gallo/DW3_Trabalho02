const Pool = require('pg').Pool; //Import da lib pg

const pool = new Pool ({ // Objeto de conexão ex: pool.user = process.env.DB_USER
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT
})

module.exports = {
    query: (text, params) => pool.query(text, params)
}