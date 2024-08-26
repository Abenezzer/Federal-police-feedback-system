const { User, joiRegisterSchema } = require("../models/User");
const overview = async (req, res) => {
  res.render("dashboard");
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
    const user = User.findOne({ username: req.body.username });
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
  console.log(req.body);
};
module.exports = { dashboard, overview, registerGet, registerPost };
