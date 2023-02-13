const Pool = require('pg').Pool
require('dotenv').config()
const {
    DB_USERNAME,
    DB_PASSWORD,
    DB_DATABASE,
    DB_HOST,
    DB_PORT
} = process.env

const pool = new Pool({
    user: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    host: DB_HOST,
    port: DB_PORT
})

module.exports = pool