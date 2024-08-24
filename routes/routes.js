const express = require("express");
require("dotenv").config();
const { loginUser } = require("../controllers/userController");
const authenticateToken = require("../middlewares/authenticateToken");
const jwt = require("jsonwebtoken");

const { dashboard } = require("../controllers/adminController");
const { joiSchema } = require("../models/User");

const router = express.Router();

router.get("/", (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    res.render("home", { errMessage: null });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (decoded.isAdmin) {
      res.send("you are admin");
    } else {
      res.send("you are regular user");
    }
  } catch (err) {
    res.status(500).redirect("/");
  }
});
router.post("/signup", (req, res) => {
  res.send("login");
});
router.post("/login", loginUser);
router.get("/dashboard", authenticateToken, dashboard);

module.exports = router;
