const Sq = require('sequelize');

module.exports = {
    name: {
        type: Sq.STRING,
        allowNull: false
    },
    email: {
        type: Sq.STRING,
        allowNull: false
    }
}
