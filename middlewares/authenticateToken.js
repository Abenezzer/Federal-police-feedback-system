require('dotenv').config();
const jwt = require("jsonwebtoken");

// Middleware to verify JWT and check if the user is an admin
function authenticateToken(req, res, next) {
  const token = req.cookies.token; // Get the token from cookies
  if (!token) return res.status(401).redirect('/');

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return res.status(403).redirect("/");

    req.user = user; // Attach user info to the request object

    // Check if the user is an admin
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).redirect("/");
    }
  });
}

module.exports = authenticateToken;
