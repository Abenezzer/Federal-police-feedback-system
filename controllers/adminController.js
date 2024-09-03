const { User, joiRegisterSchema } = require("../models/User");
const { Product, joiProductSchema } = require("../models/Product");
const overview = async (req, res) => {
  const products = await Product.find();
  if (products) {
    res.render("overview", { products: products });
  }
};
const dashboard = async (req, res) => {
  res.send("you are admin");
};

const registerGet = async (req, res) => {
  res.render("create-user", { errMessage: null, createdUser: null });
};
const registerPost = async (req, res) => {
  const { error } = joiRegisterSchema.validate(req.body);
  if (error) {
    const errMessage = error.details[0].message ?? null;
    return res
      .status(400)
      .render("create-user", { errMessage: errMessage, createdUser: null });
  } else {
    let user = await User.findOne({ username: req.body.username });
    if (user) {
      errMessage = "the username already exist!!!";
      return res
        .status(400)
        .render("create-user", { errMessage: errMessage, createdUser: null });
    }
    user = new User({
      ...req.body,
    });
    await user.save();
    return res
      .status(400)
      .render("create-user", { errMessage: null, createdUser: user });
  }
};

const addProductGet = async (req, res) => {
  res.render("add-product", { errMessage: null, productCreated: false });
};

const addProductPost = async (req, res) => {
  const { name, version, description } = req.body;
  const productDesc = {
    name,
    version,
    description,
  };
  const { error } = joiProductSchema.validate(productDesc);
  if (error) {
    const errMessage = error.details[0].message ?? null;
    return res
      .status(400)
      .render("add-product", { errMessage: errMessage, productCreated: false });
  } else {
    const product = await Product.findOne({ name: req.body.name });
    if (product) {
      const errMessage = "Product with this given name already exist";
      return res.status(400).render("add-product", {
        errMessage: errMessage,
        productCreated: false,
      });
    } else {
      const { question1, question2, question3, question4 } = req.body;
      let questions = [question1, question2, question3, question4];
      questions = questions.map((question) => {
        return { text: question };
      });
      await Product.create({ ...productDesc, questions });
      return res
        .status(201)
        .render("add-product", { errMessage: null, productCreated: true });
    }
  }
};

// controllers/productController.js

const productResponse = async (req, res) => {
  const productId = req.params.productId;

  try {
    // Step 1: Fetch the product by ID
    const product = await Product.findById(productId).exec();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const { questions, results } = product;

    // Check if there are questions available
    if (!questions.length) {
      return res
        .status(400)
        .json({ message: "No questions found for this product." });
    }

    // Step 2: Calculate total feedback submissions
    const totalResults = results.length;
    const numberOfQuestions = questions.length;
    const totalFeedbacks = Math.floor(totalResults / numberOfQuestions);

    // Optional: Check for incomplete submissions
    const incompleteSubmissions = totalResults % numberOfQuestions;

    if (incompleteSubmissions > 0) {
      console.warn(
        `There are ${incompleteSubmissions} incomplete responses detected. Total complete feedbacks counted: ${totalFeedbacks}`
      );
    }

    // Step 3: Aggregate results by question
    const aggregatedResults = questions.map((question) => {
      // Initialize the response counters
      const responseCounts = {
        poor: 0,
        average: 0,
        good: 0,
        "very-good": 0,
      };

      // Filter results for the current question and count responses
      results.forEach((result) => {
        if (result.question.toString() === question._id.toString()) {
          responseCounts[result.response] += 1;
        }
      });

      return {
        question: question.text,
        responses: responseCounts,
      };
    });

    // Step 4: Send the response
    return res.status(200).json({
      totalFeedbacks,
      aggregatedResults,
    });
  } catch (error) {
    console.error("Error fetching product ratings:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const manageProduct = async (req, res) => {
  const products = await Product.find();
  if (products) {
    res.render("manage-products", { products: products });
  }
};

const deleteProduct = async (req, res) => {
  const productId = req.params.productId;
  const product = await Product.findByIdAndDelete(productId);
  res.redirect("/admin/manage-product");
};
const listOfUsers = async (req, res) => {
  const users = await User.find();
  res.render("list-users", { users: users });
};

const deleteUser = async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findByIdAndDelete(userId);
  res.redirect("/admin/list-users");
};
const updateUser = async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);
  if (user) {
    res.render("update-user", {
      user: user,
      errMessage: null,
      createdUser: null,
    });
  }
};

const updateUserPost = async (req, res) => {
  const user = await User.findById(req.body.userId);
  const userObj = {
    name: req.body.name,
    username: req.body.username,
    password: req.body.password,
  };
  const { error } = joiRegisterSchema.validate(userObj);
  if (error) {
    const errMessage = error.details[0].message ?? null;
    return res.status(400).render("create-user", {
      user: user,
      errMessage: errMessage,
      createdUser: null,
    });
  } else {
    const updatedUser = await User.findByIdAndUpdate(
      req.body.userId, // The ID of the document to update
      userObj, // The update data
      { new: true } // Return the updated document
    );
    res.redirect("/admin/list-users");
  }
};

module.exports = {
  dashboard,
  overview,
  registerGet,
  registerPost,
  addProductGet,
  addProductPost,
  productResponse,
  manageProduct,
  deleteProduct,
  listOfUsers,
  deleteUser,
  updateUser,
  updateUserPost,
};
