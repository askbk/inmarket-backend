class ActivityAPI {
    constructor(activityController, auth) {
        this.activityController = activityController;
        this.auth = auth;
    }

    async getAll(req, res, next) {
        try {
            const userId = res.params.id;
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
}

module.exports = ActivityAPI;
