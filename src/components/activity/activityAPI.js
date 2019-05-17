class ActivityAPI {
    constructor(activityController, auth) {
        this.activityController = activityController;
        this.auth = auth;
    }

    // TODO: Add authentication
    async getAll(req, res, next) {
        try {
            const userId = req.params.id;
            const result = await this.activityController.getAll(userId);

            res.status(200).send(result);

            return true;
        } catch (e) {
            res.status(500).send({
                success: false,
                message: `Error when fetching activities: ${e}`
            });

            return false;
        }
    }

    // TODO: Add authentication
    // TODO: Verify that user has permission to get the activity
    async getByID(req, res, next) {
        try {
            // const authenticated = await this.auth.authenticate(req, res, next);
            // if (authenticated) {
            // }
            const id = req.params.id;
            const activity = await this.activityController.getByID(id);

            res.status(200).send(activity);

            return true;
        } catch (e) {
            res.status(500).send({
                success: false,
                message: `Error when fetching activity: ${e}`
            });

            return false;
        }
    }

    // TODO: Add authentication
    async create(req, res, next) {
        const {
            name,
            description,
            startDateUTC,
            endDateUTC,
            duration,
            isRecurring,
            recurrencePattern
        } = req.body;

        try {
            await this.activityController.create({
                name,
                description,
                startDateUTC,
                endDateUTC,
                duration,
                isRecurring,
                recurrencePattern
            });

            res.status(200).send({
                success: true,
                message: 'Activity created'
            });

            return true;
        } catch (e) {
            res.status(500).send({
                success: false,
                message: `Error when creating activity: {e}`
            });

            return false;
        }
    }

    // TODO: Authenticate the user sending the invitation.
    // TODO: Verify that the user sending the invitation has permission to do so.
    async invite(req, res, next) {
        const userId = req.params.userId,
            activityId = req.params.activityId;

        try {
            await this.activityController.invite(userId, activityId);

            res.status(200).send({
                success: true,
                message: "Activity invitation sent."
            });

            return true;
        } catch (e) {
            res.status(500).send({
                success: false,
                message: `Error when sending activity invitation: ${e}`
            });

            return false;
        }
    }

    // TODO: Authenticate user
    async acceptInvitation(req, res, next) {
        const userId = req.params.userId,
            activityId = req.params.activityId;

        try {
            await this.activityController.acceptInvitation(userId, activityId);

            res.status(200).send({
                success: true,
                message: "Activity invitation accepted."
            });

            return true;
        } catch (e) {
            res.status(500).send({
                success: false,
                message: `Error when accepting activity invitation: ${e}`
            });

            return false;
        }
    }

    // TODO: Authenticate user
    // TODO: Verify that the user has permission to edit the activity
    async update(req, res, next) {
        const activity = {...req.body, activityId: req.params.id};

        try {
            await this.activityController.update(activity);

            res.status(200).send({
                success: true,
                message: "Activity updated."
            });

            return true;
        } catch (e) {
            res.status(500).send({
                success: false,
                message: `Error when updating activity${req.params.id}: ${e}`
            });

            return false;
        }
    }
}

module.exports = ActivityAPI;
