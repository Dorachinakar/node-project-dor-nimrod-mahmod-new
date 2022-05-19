//express mongose
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 2423;
//cors
const cors = require("cors");
let corsOptions = {
  origin: "http://example1.com",
  optionsSuccessStatus: 200,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

//chalk
const chalk = require("chalk");
const log = chalk.bold.white.bgGreen;
const error = chalk.bold.white.bgRed;

// siteRouter = require("./routers/siterouter"),
// scrapedRouter = require("./routers/scrapedrouter");

//middelware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
// app.use("/site", siteRouter);
// app.use("/scraped", scrapedRouter)

//morgan
const morgan = require("morgan");
app.use(morgan("tiny", { stream: accessLogStream }));

//import that we build
const User = require("./models/user");
const { addUser, getAllUsers } = require("./controllers/users");

//js import
var fs = require("fs");
var path = require("path");

//logger
let accessLogStream = fs.createWriteStream(path.join(__dirname, "logger.log"), {
  flags: "a",
});

//all get req
app.get("/getALLUsers", cors(corsOptions), (req, res) => {
  getAllUsers()
    .then((user) => {
      console.log(log("get all user"));
      res.status(201).json("sucsses");
    })
    .catch((err) => res.json(error(err)));
});
//all post req
app.post("/addUser", (req, res) => {
  let { name, password, phone, isVip } = req.body;
  const user = { name, password, phone, isVip };
  addUser(user)
    .then((user) => {
      res.json(user);
      console.log(log("user is addit"));
    })
    .catch((err) => {
      res.json(err);
      console.log(error(err));
    });
});

//connection
mongoose
  .connect("mongodb://0.0.0.0:27017/project-node")
  .then(() => {
    app.listen(port, () => {
      console.info(`start server start listening on port ${port}`);
    });
  })
  .catch((err) => console.error(err));
