// const jwt = require("jsonwebtoken");

// const verifyToken = (req, res, next) => {
//   try {
//     const authHeader = req.headers["authorization"];
//     const token = authHeader && authHeader.split(" ")[1];
//     if (!token) {
//       return res.status(401).send({
//         error: true,
//         message: `Unauthorized`,
//       });
//     }
//     const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

//     req.userId = user.userId;
//     next();
//   } catch (error) {
//     return res.status(401).send({
//       error: true,
//       message: error.message,
//     });
//   }
// };

// module.exports = verifyToken;

const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    // Pastikan ada header Authorization dan token tidak kosong
    if (!authHeader) {
      return res.status(401).send({
        error: true,
        message: "Unauthorized: No token provided",
      });
    }

    // Ambil token dari header
    const token = authHeader.split(" ")[1];

    // Verifikasi token
    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Simpan informasi user ke request
    req.userId = user.userId; // Pastikan 'userId' ada dalam payload token
    next(); // Lanjutkan ke route handler berikutnya
  } catch (error) {
    // Tangani kesalahan dengan lebih informatif
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).send({
        error: true,
        message: "Forbidden: Invalid token",
      });
    }
    return res.status(500).send({
      error: true,
      message: "Internal Server Error: " + error.message,
    });
  }
};

module.exports = verifyToken;
