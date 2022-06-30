const User = require("../models/user");

const jwt = require("jsonwebtoken"),
  Joi = require("joi");
function addUser(user) {
  return new Promise(async (resolve, reject) => {
    const newUser = new User(user);
    const { error, value } = newUser.validateUserSchema().validate(user);
    if (error) reject(error);
    else {
      const regex = new RegExp(
        "^(?=.*?[A-Z])(?=.*?[a-z])(?=(.*?[0-9]){4})(?=.*?[#?!@$%^&*-]).{9,9}$"
      );
      let statusRegex = regex.test(newUser.password);
      if (statusRegex) {
        await newUser.hashPassword();
        newUser
          .save()
          .then((user) => resolve(user))
          .catch((err) => reject(err));
      } else {
        reject({
          details: [
            {
              message:
                "password must includes small and camel letters,4digits,lenght:9,and one !@#$%^&*",
            },
          ],
        });
      }
    }
  });
}

function getAllUsers() {
  return new Promise((resolve, reject) => {
    User.find()
      .then((user) => resolve(user))
      .catch((err) => reject(err));
  });
}

function setUserIsAdmin(_id) {
  return new Promise(async (resolve, reject) => {
    const user = await User.findById(_id);
    user.isAdmin = true;
    user
      .save()
      .then((user) => resolve(user))
      .catch((err) => reject(err));
  });
}

const generateToken = (user) => {
  return jwt.sign({ user_id: user._id, isVip: user.isVip }, "myKey", {
    expiresIn: "31111m",
  });
};

function getUserById(_id) {
  return new Promise((resolve, reject) => {
    User.findById(_id)
      .then((User) => resolve(User))
      .catch((err) => reject(err));
  });
}

module.exports = {
  getAllUsers,
  getUserById,
  addUser,
  generateToken,
  setUserIsAdmin,
};
