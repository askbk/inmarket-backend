class QualityController {
    constructor(models) {
        this.skillModel = models.Skill;
        this.interestModel = models.Interest;
    }

    async getAllSkills() {
        return this.skillModel.findAll().then(skills => {
            return skills;
        });
    }

    async getAllInterests() {
        return this.interestModel.findAll().then(interests => {
            return interests;
        });
    }

}

module.exports = QualityController;
