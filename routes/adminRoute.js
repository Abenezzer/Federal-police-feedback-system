const express = require("express");
const {
  dashboard,
  overview,
  registerGet,
  registerPost,
} = require("../controllers/adminController");
const authenticateToken = require("../middlewares/authenticateToken");
const router = express.Router();

router.get("/overview", overview);
router.get("/dashboard", dashboard);
router.get("/register", registerGet);
router.post("/register", registerPost);

module.exports = router;
