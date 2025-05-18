const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authorization = req.headers["authorization"];
  if (!authorization) return res.sendStatus(403);

  const token = authorization.split(" ")[1];
  if (!token) return res.sendStatus(403);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};


module.exports = verifyToken;