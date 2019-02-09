const express = require("express");
const app = express();
const http = require("http").Server(app);
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: "database",
    user: "ask",
    password: "123",
    database: "inmarket_db",
    connectionLimit: 5
});

async function testDBConnection() {
    let conn;
    try {
        conn = await pool.getConnection();
        console.log("connected ! connection id is " + conn.threadId)
    } catch (err) {
        throw err;
    } finally {
        if (conn) return conn.end();
    }
}

testDBConnection();

const appdir = __dirname + "/app";
const test_path = __dirname + "/testdata";
const port = 3000;

const Users = require("./api/users.js"),
    Token = require('./token.js');

const users = new Users(pool),
    token = new Token();

app.use(bodyParser.json());

//  Let app take care of everything except API
app.get(/^(?!\/api\/)/, express.static(appdir));


app.use("/api/test", (req, res, next) => {
    res.status(200).send('Hello world!');
});

app.post("/api/login", (req, res, next) => {
    res.send(JSON.stringify(req.body));
});

app.get("/api/getbyemail/:email", (req, res, next) => {
    try {
        res.json(users.getId(req.params.email));
    } catch (e) {
        throw e;
    }
})

app.get("/api/users/:id",  (req, res, next) => {
    try {
        users.getUser(req, res, next);
    } catch (e) {
        throw e;
    }
});

app.post("/api/users",  (req, res, next) => {
    try {
        users.postUser(req, res, next);
    } catch (e) {
        throw e;
    }
});

http.listen(port, () => {
    console.log("listening on port " + port + " at " + new Date().toTimeString());
});
