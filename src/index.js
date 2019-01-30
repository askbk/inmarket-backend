const app = require("express")();
const express = require("express");
const http = require("http").Server(app);
const appdir = __dirname + "/app";
app.use(express.static(appdir));

app.get("/", (req, res) => {
    res.sendFile(appdir + "/index.html");
});

http.listen(3000, () => {
    console.log("listening on port 3000");
});
