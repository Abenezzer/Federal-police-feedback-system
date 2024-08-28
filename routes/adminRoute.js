const express = require("express");
const {
  dashboard,
  overview,
  registerGet,
  registerPost,
  addProductGet,
  addProductPost,
  productResponse,
} = require("../controllers/adminController");
const authenticateToken = require("../middlewares/authenticateToken");
const router = express.Router();

router.get("/overview", overview);
router.get("/dashboard", dashboard);
router.get("/register", registerGet);
router.post("/register", registerPost);
router.get("/add-product", addProductGet);
router.post("/add-product", addProductPost);
router.get("/product-responses/:productId", productResponse);

module.exports = router;
