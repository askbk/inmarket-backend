const express = require("express");
const app = express();
const http = require("http").Server(app);
const fs = require("fs");   //  For å teste API

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

app.use(bodyParser.json());

//  Let app take care of everything except API
app.get(/^(?!\/api\/)/, express.static(appdir));


app.use("/api/test", (req, res, next) => {
    res.status(200).send('Hello world!');
});

app.post("/api/login", (req, res, next) => {
    res.send(JSON.stringify(req.body));
});

app.get("/api/getUser/:id", (req, res, next) => {
    fs.readFile(test_path + "/user.json", 'utf8', (err, data) => {
        const users = JSON.parse( data );
        const user = users[req.params.id]
        res.json(user);
    });
});

app.post("/api/register", (req, res, next) => {
    const user = req.body;
    try {
        insertUser(user);
    } catch (e) {
	    console.error(e);
        throw e;
	}
});

http.listen(port, () => {
    console.log("listening on port " + port + " at " + new Date().toTimeString());
});

async function insertUser(user) {
    let conn;
    try {
        conn = await pool.query(`INSERT INTO user (name, email, phone,
										kommuneNr, adminLevel, password,
										createTime, userType, profilePicture)
									VALUES (?, ?, ?, 1, 0, ?, NOW(), ?, ?)`,
									[user.name, user.email, user.phone,
                                    user.password, user.userType,
                                    "img/stock-profile.jpg"]);
		// console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
    } catch (err) {
        throw err;
    } finally {
        console.log("hleoo");
    }
}
