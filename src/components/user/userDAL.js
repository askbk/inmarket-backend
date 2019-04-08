class UserDAL {
    constructor(userModel) {
        this.userModel = userModel;
    }

    async getAll() {
        return this.userModel.findAll().then(users => {
            return users;
        });
    }

    async getByID(id) {}

    async insert(user) {}

    async getIDByEmail(email) {}
}

module.exports = UserDAL;
