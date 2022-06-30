const User = require("../models/user");
const { getUserById } = require("../controllers/users");
const isAdmin = async (req, res, next) => {
  try {
    const adminUser = await getUserById(req.user_id);
    if (!adminUser.isAdmin) return res.status(401).send("u are not an admin");
    else return next();
  } catch (err) {
    return res.status(401).send(err);
  }
};

module.exports = isAdmin;
