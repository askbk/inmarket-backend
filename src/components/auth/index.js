const Auth = require("./auth.js");

module.exports = userDAL => {
    return new Auth(userDAL);
}
