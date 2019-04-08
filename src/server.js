const app = require("./app.js");
const http = require("http").Server(app);
const port = 5000;

// const mariadb = require('mariadb');
// const pool = mariadb.createPool({
//     host: "database",
//     user: "ask",
//     password: "123",
//     database: "inmarket_db",
//     connectionLimit: 5
// });
//
// async function testDBConnection() {
//     let conn;
//     try {
//         conn = await pool.getConnection();
//         console.log("connected! connection id is " + conn.threadId)
//     } catch (err) {
//         throw err;
//     } finally {
//         if (conn) return conn.end();
//     }
// }
//
// testDBConnection();

http.listen(port, () => {
    console.log("listening on port " + port + " at " + new Date().toTimeString());
    console.log("cors is enabled");
});
