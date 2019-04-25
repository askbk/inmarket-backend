class UserDAL {
    constructor(models) {
        this.userModel = models.User;
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
}

module.exports = UserDAL;
