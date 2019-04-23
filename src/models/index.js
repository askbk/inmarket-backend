const Sq = require("sequelize");

module.exports = sequelize => {
    const User = require("./userModel.js")(sequelize);
}
