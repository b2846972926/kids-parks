const db = require("../db");

const findUserByUsername = async (username) => {
  const [rows] = await db.query(`SELECT * FROM users WHERE username = ?`, [
    username,
  ]);
  return rows[0];
};

const createUser = async (username, password) => {
  await db.query(`INSERT INTO users(username,password) VALUES (?,?)`, [
    username,
    password,
  ]);
};

module.exports = {
  findUserByUsername,
  createUser,
};
