const mongoose = require("mongoose");
const Joi = require("joi");

const userShcema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 30,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

const joiSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required().min(6).max(30),
});

const User = mongoose.model("user", userShcema);

module.exports = { User, joiSchema };
