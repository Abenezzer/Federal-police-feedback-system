require("dotenv").config();
const { User, joiLoginSchema } = require("../models/User");
const jwt = require("jsonwebtoken");

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

module.exports = { loginUser, logout };
