class UserDAL {
    constructor(userModel) {
        this.userModel = userModel;
    }

    async getAll() {
        return this.userModel.findAll().then(users => {
            return users;
        });
    }

    async getByID(id) {
        return this.userModel.findByPk(id).then(user => {
            return user;
        });
    }

    async create(user) {}

    async getIDByEmail(email) {
        return this.userModel.findOne(
            {
                where: {
                    email: email
                }
            }
        ).then(user => {
            return user;
        });
    }

    async getPasswordHash(id) {
        return this.userModel.findOne({
            attributes: ["passwordHash"],
            where: {
                id: id
            }
        }).then(passwordHash => {
            return passwordHash;
        });
    }
}

module.exports = UserDAL;
