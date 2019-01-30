const app = require("express")();
const http = require("http").Server(app);

app.get("/", (req, res) => {
    res.sendFile("/srv/http/inmarket-app/index.html");
});

http.listen(3000, () => {
    console.log("listening on port 3000");
});
