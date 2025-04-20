const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const SECRET = "rosiecutecute";

const register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "帳號和密碼是必填的" });
  }
  const isUserExist = await userModel.findUserByUsername(username);
  if (isUserExist) {
    return res.status(409).json({ message: "username已重複" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await userModel.createUser(username, hashedPassword);
  res.status(201).json({ message: "已註冊成功" });
};

const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await userModel.findUserByUsername(username);
  if (!user) return res.status(401).json({ message: "無此帳號" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "密碼錯誤" });

  const token = jwt.sign({ id: user.id, username: user.username }, SECRET, {
    expiresIn: "1h",
  });
  const { password: hashedPassword, ...safeUser } = user;
  res.json({ user: safeUser, token });
};

module.exports = {
  register,
  login,
};
