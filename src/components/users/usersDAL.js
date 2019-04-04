const DAL = require("../DAL.js");

module.exports =  class UsersDAL extends DAL {
    constructor() {
        super();
    }

    async getAll() {
        const sql = `SELECT *
                    FROM user`;

        const conn = await this.pool.getConnection();
        const result = await conn.query(sql);
        delete result.meta;

        return new Promise((resolve, reject) => {

            resolve(result)
        });
    }

    async getByID(id) {
        const sql = `SELECT *
                    FROM user
                    WHERE user.user_id = ?`,
        values = [id];

        const conn = await this.pool.getConnection();
        const result = await conn.query(sql, values);
        delete result.meta;
        console.log(result);

        return new Promise((resolve, reject) => {

            resolve(result)
        });
    }

    async insert(user) {
        const sql = `INSERT INTO user (name, email, phone, kommuneNr,
                        adminLevel, password, createTime, userType,
                        profilePicture)
                    VALUES (?, ?, ?, 1, 0, ?, NOW(), ?, ?)`,
            values = [
                user.name,
                user.email,
                user.phone,
                user.password,
                user.userType,
                "img/stock-profile.jpg"
            ];

        let conn;
        try {
            conn = await this.pool.getConnection();
            const result = await conn.query(sql);
            return result;
        } catch (e) {
            throw e;
        } finally {
            if (conn) return conn.end();
        }
    }

    async getIDByEmail(email) {
        const sql = `SELECT *
                    FROM user
                    WHERE email='?'`,
            values = [email];

        let conn;
        try {
            conn = await this.pool.getConnection();
            const result = await conn.query(sql);
            return result;
        } catch (e) {
            throw e;
        } finally {
            if (conn) return conn.end();
        }
    }
}
