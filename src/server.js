const express = require("express");
const app = express();
const http = require("http").Server(app);
const fs = require("fs");   //  For å teste API

const appdir = __dirname + "/app";
const test_path = __dirname + "/testdata";
const port = 3000;

//  Let app take care of everything except API
app.get(/^(?!\/api\/)/, express.static(appdir));

app.use("/api/test", (req, res, next) => {
    res.status(200).send('Hello world!');
});

app.post("/api/login", (req, res, next) => {
    res.json(req.params);
});

app.get("/api/getUser/:id", (req, res, next) => {
    fs.readFile(test_path + "/user.json", 'utf8', (err, data) => {
        const users = JSON.parse( data );
        const user = users[req.params.id]
        res.json(user);
    });
});

http.listen(port, () => {
    console.log("listening on port " + port);
});
