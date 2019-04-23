const Sq = require('sequelize');
const UserModel = require("./models/user");
const sequelize = new Sq(
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

const User = UserModel(sequelize, Sq);

//  Define relations here...

sequelize.sync(
    {force: true}
).then(() => {
    console.log("sequelize initiated");
}).catch((err) => {
    console.log("error:" + err);
});

module.exports = {
    User,
}
