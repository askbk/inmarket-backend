const Auth = require("./auth.js");
const AuthDAL = require("./authDAL.js");

module.exports = models => {
    const authDAL = new AuthDAL(models);
    return new Auth(authDAL);
}
