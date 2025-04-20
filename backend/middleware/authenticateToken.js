const jwt = require("jsonwebtoken");
const SECRET = "rosiecutecute";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "缺少token" });
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "無效或過期的 token" });
    req.user = user;
  });
  next();
};

module.exports = authenticateToken;
