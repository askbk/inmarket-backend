const API = require('./api.js');

module.exports =  class Users extends API {
    constructor(pool) {
        super(pool);
    }

    async getUser(req, res, next) {
        const userId = req.params.id,
            sql = `SELECT * FROM user WHERE user.user_id = ?`,
            values = [userId];
        let conn;
        try {
            conn = await this.pool.getConnection();
            const result = await conn.query(sql, values);
            res.json(result);
        } catch (e) {
            res.status(500).send(e);
            throw e;
        }
    }

    async postUser(req, res, next) {
        const user = req.body,
            sql = `INSERT INTO user (name, email, phone, kommuneNr,
                        adminLevel, password, createTime, userType,
                        profilePicture)
                    VALUES (?, ?, ?, 1, 0, ?, NOW(), ?, ?)`,
            values = [user.name, user.email, user.phone, user.password,
                        user.userType, "img/stock-profile.jpg"];
        let conn;
        try {
            conn = await this.pool.getConnection();
            const result = await conn.query(sql, values);
        } catch (e) {
            res.status(500).send(e);
            throw e;
        }
    }
}
