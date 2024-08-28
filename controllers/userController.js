require("dotenv").config();
const { User, joiLoginSchema } = require("../models/User");
const { Product } = require("../models/Product");
const { isValidObjectId } = require("mongoose");
const jwt = require("jsonwebtoken");

const home = async (req, res) => {
  console.log("calling a home controller");
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
        .cookie("userId", user._id, {
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
  console.log("make a form request");
  const productId = req.params.id;
  const { userId } = req.cookies;
  const user = await User.findById(userId);
  if (user.reviewedProducts.includes(productId)) {
    return res.render("feedback-form", {
      questions: null,
      productId: null,
      success: -1,
    });
  }
  const product = await Product.findById(productId);
  console.log(req.params.id + " make request");
  if (product) {
    const questions = product.questions;
    console.log(questions);
    res.render("feedback-form", {
      questions: questions,
      productId: productId,
      success: 0,
    });
  }
};

const reviewProduct = async (req, res) => {
  const products = await Product.find();
  const { productId } = req.body;
  const { userId } = req.cookies;
  const user = await User.findById(userId);

  const product = await Product.findById(productId);
  let feedback = {};
  product.questions.forEach((question) => {
    feedback["question"] = question._id;
    feedback["response"] = req.body[question._id];
    product.results.push(feedback);
    feedback = {};
  });
  await product.save();
  if (isValidObjectId(userId)) {
    if (!user.reviewedProducts.includes(productId)) {
      // If not, add it to the array
      user.reviewedProducts.push(productId);
      console.log(user);
      await user.save(); // Save the updated user document
    }
  }
  res.render("success");
};

module.exports = { loginUser, logout, home, getProductForm, reviewProduct };
