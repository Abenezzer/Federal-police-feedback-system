const { User, joiRegisterSchema } = require("../models/User");
const overview = async (req, res) => {
  res.render("dashboard");
};
const dashboard = async (req, res) => {
  res.send("you are admin");
};
const { Product, joiProductSchema } = require("../models/Product");

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
      console.log(user);
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

const productResponse = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId)
      .populate("results.question")
      .exec();

    if (!product) return res.status(404).send("Product not found.");

    // Aggregate the responses
    const responseAggregation = product.results.reduce(
      (acc, result) => {
        acc[result.response] += 1;
        return acc;
      },
      { poor: 0, average: 0, good: 0, "very-good": 0 }
    );

    res.send(responseAggregation);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error.");
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
};
