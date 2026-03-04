const jwt = require("jsonwebtoken");

// 1. Kalkan: Sadece giriş yapmış olanlar geçebilir
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1]; // Bearer <token>
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json("Token geçersiz!");
      req.user = user;
      next();
    });
  } else {
    res.status(401).json("Giriş yapmalısınız!");
  }
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "admin") {
      next();
    } else {
      res.status(403).json("Bu işlem için Admin yetkisi gerekiyor!");
    }
  });
};

module.exports = { verifyToken, verifyAdmin };