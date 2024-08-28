const mongoose = require("mongoose");
const Joi = require("joi");

const userShcema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
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
  reviewedProducts: [mongoose.Schema.Types.ObjectId],
});

const joiLoginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required().min(6).max(30),
});
const joiRegisterSchema = Joi.object({
  name: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required().min(6).max(30),
  confirmPassword: Joi.ref("password"),
});

const User = mongoose.model("user", userShcema);

module.exports = { User, joiLoginSchema, joiRegisterSchema };
