const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors')

const appdir = __dirname + "/app";
const test_path = __dirname + "/testdata";

const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    "inmarket_db",
    "ask",
    "123", {
    host: "database",
    dialect: "mariadb"
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const user = require("./components/user")(sequelize);
const login = require("./components/login")(user.userDAL);

//  Add middleware
app.use(cors());
app.use(bodyParser.json());

//  Add router for /api/users endpoint(s)
app.use("/api/users", user);

app.use("/api/login", login);

// app.post("/api/login", (req, res, next) => {
//     res.send(JSON.stringify(req.body));
// });
app.use("/api/test", (req, res, next) => {
    res.status(200).send('Hello world!');
});






module.exports = app;
