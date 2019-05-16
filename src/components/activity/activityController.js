class ActivityController {
    constructor(models) {
        this.activityModel = models.Activity;
        this.userModel = models.User;
    }

    async getAll(userId) {
        // TODO: Filter out activities where end date is in the past
        const activities = await this.userModel.findByPk(userId, {
            include: [{
                model: this.activityModel,
                required: true
            }]
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

module.exports = ActivityController;
