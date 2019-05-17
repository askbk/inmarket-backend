class ActivityController {
    constructor(models) {
        this.activityModel = models.Activity;
        this.userModel = models.User;
    }

    // Returns all activities and invitations to activities for a user.
    async getAll(userId) {
        // TODO: Filter out activities where end date is in the past
        const user = await this.userModel.findByPk(userId, {
            include: [{
                model: this.activityModel,
                as: "activities"
            }, {
                model: this.activityModel,
                as: "activityInvitations"
            }]
        });

        return {activities: user.activities, activityInvitations: user.activityInvitations};
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

    async update(activityContext) {
        try {
            const activity = await this.activityModel.findByPk(activityContext.activityId);

            await activity.update(activityContext);
            console.log(activityContext);
            return true;
        } catch (e) {
            throw e;
        }
    }

    async invite(userId, activityId) {
        try {
            const user = await this.userModel.findByPk(userId);

            await user.addActivityInvitations(activityId);

            return true;
        } catch (e) {
            throw e;
        }
    }

    async acceptInvitation(userId, activityId) {
        try {
            const user = await this.userModel.findByPk(userId);

            const invitations = await user.getActivityInvitations();
            for (const invitation of invitations) {
                // Need to use type coercion in comparison because invitation.id
                // is a string.
                // TODO: Maybe fix this so that === can be used
                if (invitation.id == activityId) {
                    const activity = await this.activityModel.findByPk(activityId);
                    await user.addActivity(activity);

                    return true;
                }
            }

            throw `No invitation to activity${activityId} was found for user${userId}.`
        } catch (e) {
            throw e;
        }
    }
}

module.exports = ActivityController;
