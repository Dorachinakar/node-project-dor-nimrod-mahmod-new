const mongoose = require("mongoose");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: "The field name is a required field!",
    },
    password: {
      type: String,
      required: "The tz text is a required field!",
    },

    isVip: {
      type: Boolean,
      required: "tell me if u are a vip",
    },
    email: {
      type: String,
      required: "The email is a required field!",
      unique: true,
    },
    cards: {
      type: [Object],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.methods.validateUserSchema = function (user) {
  const blogschema = Joi.object({
    name: Joi.string().required(),
    isVip: Joi.boolean().required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(6).required(),
    cards: Joi.required(),
  });
  return blogschema;
};
userSchema.methods.hashPassword = async function () {
  this.password = await bcrypt.hash(this.password, 10);
};

module.exports = mongoose.model("User", userSchema, "users");
