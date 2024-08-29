const mongoose = require("mongoose");
const Joi = require("joi");

const QuestionSchema = new mongoose.Schema({
  text: { type: String, required: true },
});

const ResultSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  response: {
    type: String,
    enum: ["poor", "average", "good", "very-good"],
    required: true,
  },
});
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    version: {
      type: String,
    },
    description: {
      type: String,
    },
    questions: {
      type: [QuestionSchema],
      validate: {
        validator: function (arr) {
          return arr.length <= 4;
        },
        message: "You can only add up to 4 questions.",
      },
    },
    results: [ResultSchema],
  },
  { timestamps: true }
);

const joiProductSchema = Joi.object({
  name: Joi.string().required(),
  version: Joi.string(),
  description: Joi.string(),
});

const Product = mongoose.model("product", productSchema);

module.exports = { Product, joiProductSchema };
