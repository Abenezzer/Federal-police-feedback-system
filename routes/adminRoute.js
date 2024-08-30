const express = require("express");
const {
  dashboard,
  overview,
  registerGet,
  registerPost,
  addProductGet,
  addProductPost,
  productResponse,
  manageProduct,
  deleteProduct
} = require("../controllers/adminController");
const router = express.Router();

router.get("/overview", overview);
router.get("/dashboard", dashboard);
router.get("/register", registerGet);
router.post("/register", registerPost);
router.get("/add-product", addProductGet);
router.post("/add-product", addProductPost);
router.get("/product-responses/:productId", productResponse);
router.get("/manage-product", manageProduct);
router.get("/delete-product/:productId", deleteProduct);

module.exports = router;
