const express = require("express");
const {
  dashboard,
  overview,
  registerGet,
  registerPost,
  addProductGet,
  addProductPost,
} = require("../controllers/adminController");
const authenticateToken = require("../middlewares/authenticateToken");
const router = express.Router();

router.get("/overview", overview);
router.get("/dashboard", dashboard);
router.get("/register", registerGet);
router.post("/register", registerPost);
router.get("/add-product", addProductGet);
router.post("/add-product", addProductPost);

module.exports = router;
