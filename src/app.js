const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors')

const appdir = __dirname + "/app";
const test_path = __dirname + "/testdata";

const users = require("./components/users");

//  Add middleware
app.use(cors());
app.use(bodyParser.json());

//  Add router for /api/users endpoint(s)
app.use("/api/users", users);

//  Serve app
// app.get(/^(?!\/api\/)/, express.static(appdir));


app.use("/api/test", (req, res, next) => {
    res.status(200).send('Hello world!');
});

app.post("/api/login", (req, res, next) => {
    res.send(JSON.stringify(req.body));
});



module.exports = app;
