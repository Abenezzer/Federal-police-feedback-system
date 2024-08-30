const express = require("express");
require("dotenv").config();
const {
  loginUser,
  logout,
  home,
  getProductForm,
  reviewProduct,
} = require("../controllers/userController");
const router = express.Router();

router.get("/", home);
router.post("/login", loginUser);
router.get("/logout", logout);
router.get("/get-question/:id", getProductForm);
router.post("/review-product", reviewProduct);
router.get("/back-home", (req, res) => {
  res.redirect("/");
});

module.exports = router;
