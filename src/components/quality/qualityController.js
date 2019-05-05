class QualityController {
    constructor(models) {
        this.skillModel = models.Skill;
    }

    async getAllSkills() {
        return this.skillModel.findAll().then(users => {
            return users;
        });
    }

    async getAllInterests() {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }

}

module.exports = QualityController;
