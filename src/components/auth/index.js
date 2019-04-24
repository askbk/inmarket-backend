const Auth = require("./auth.js");

module.exports = models => {
    return new Auth(models);
}
