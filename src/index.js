const express = require("express");
const app = express();
const http = require("http").Server(app);

const appdir = __dirname + "/app";
const port = 3000;

app.use("/", express.static(appdir));

http.listen(port, () => {
    console.log("listening on port " + port);
});
