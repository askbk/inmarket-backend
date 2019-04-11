const Sq = require('sequelize');

module.exports = {
    id: {
        type: Sq.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sq.STRING,
        allowNull: false
    },
    email: {
        type: Sq.STRING,
        allowNull: false
    },
    password: {
        type: Sq.STRING,
        allowNull: false
    }
}
