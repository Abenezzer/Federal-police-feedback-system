require("dotenv").config();
const { User, joiSchema } = require("../models/User");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
  const { error} = joiSchema.validate(req.body);
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
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 3600000,
      });
      res.status(200).send(`wellcome ${user.username}`);
    }
  } else {
    const errMessage = error.details[0].message ?? null;
    res.status(400).render("home", { errMessage });
  }
};

module.exports = { loginUser };
