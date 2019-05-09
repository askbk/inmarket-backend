const Auth = require('./auth.js');
const AuthController = require('./authController.js');

module.exports = models => {
    const authController = new AuthController(models);
    return new Auth(authController, models);
};
