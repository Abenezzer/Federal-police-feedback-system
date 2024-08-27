require("dotenv").config();
const { User, joiLoginSchema } = require("../models/User");
const { Product } = require("../models/Product");
const { isValidObjectId } = require("mongoose");
const jwt = require("jsonwebtoken");

const home = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.render("home", { errMessage: null });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (decoded.isAdmin) {
      return res.redirect("/admin/overview");
    } else {
      const products = await Product.find();
      return res.render("user-feedback", {
        products: products,
        success: false,
      });
    }
  } catch (err) {
    return res.status(500).redirect("/");
  }
};

const loginUser = async (req, res) => {
  const { error } = joiLoginSchema.validate(req.body);
  if (error === undefined) {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (!user) {
      const errMessage = "Invalid credentials";
      res.status(400).render("home", { errMessage });
    } else {
      //   add jwt auth
      console.log(user);
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );
      res
        .cookie("token", token, {
          httpOnly: true,
          maxAge: 3600000,
        })
        .status(200)
        .redirect("/");
    }
  } else {
    const errMessage = error.details[0].message ?? null;
    res.status(400).render("home", { errMessage });
  }
};

const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
  });
  res.status(200).redirect("/");
};

// get and review products

const getProductForm = async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findById(productId);
  console.log(req.params.id + " make request");
  if (product) {
    const questions = product.questions;
    res.render("feedback-form", { questions: questions, productId: productId });
  }
};

const reviewProduct = async (req, res) => {
  const { productId } = req.body;

  const product = await Product.findById(productId);
  let feedback = {};
  product.questions.forEach((question) => {
    feedback["question"] = question._id;
    feedback["response"] = req.body[question._id];
    product.results.push(feedback);
    feedback = {};
  });
  await product.save();
  res.render("user-feedback", { products: null, success: true });
};

module.exports = { loginUser, logout, home, getProductForm, reviewProduct };
