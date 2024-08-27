const express = require("express");
require("dotenv").config();
const {
  loginUser,
  logout,
  home,
  getProductForm,
} = require("../controllers/userController");

const jwt = require("jsonwebtoken");

const { dashboard } = require("../controllers/adminController");
const { joiSchema } = require("../models/User");

const router = express.Router();

router.get("/", home);
router.post("/login", loginUser);
router.get("/logout", logout);
router.get("/get-question/:id", getProductForm);
router.post("/review-product", (req, res) => {
  console.log(req.body);
  res.send("success");
});

module.exports = router;
