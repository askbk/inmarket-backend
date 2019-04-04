const mariadb = require('mariadb');

module.exports = class DAL {
    constructor() {
        this.pool = mariadb.createPool({
            host: "database",
            user: "ask",
            password: "123",
            database: "inmarket_db",
            connectionLimit: 5
        });
    }
}
