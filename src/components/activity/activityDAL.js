class ActivityDAL {
    constructor(models) {
        this.activityModel = models.Activity;
    }

    async getAll() {
        return this.activityModel.findAll().then(activites => {
            return activites;
        });
    }

    async getByID(id) {
        return this.activityModel.findByPk(id).then(activity => {
            return activity;
        });
    }

    async create(activity) {
        try {
            const result = await this.activityModel.create({
                ...activity
            });
        } catch (e) {
            throw e;
        }
    }
}

module.exports = ActivityDAL;
