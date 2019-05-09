const express           = require("express");
const app               = express();
const bodyParser        = require("body-parser");
const cors              = require('cors')

const models            = require("./sequelize");
const user              = require("./components/user")(models);
const login             = require("./components/login")(models);
const activity          = require("./components/activity")(models);
const quality           = require("./components/quality")(models);
const recommendation    = require("./components/recommendation")(models);

//  Add middleware for cors, json parsing, etc.
app.use(cors());
app.use(bodyParser.json());

app.use("/api/users", user);
app.use("/api/login", login);
app.use("/api/activities", activity);
app.use("/api/qualities", quality);
app.use("/api/recommendations", recommendation);
app.use("/api/test", (req, res, next) => {
    res.status(200).send('Hello world!');
});

module.exports = app;
