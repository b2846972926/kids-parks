const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "0917268798a",
  database: "kids",
});

module.exports = db;
