class ActivityAPI {
    constructor(activityController, models) {
        // this.auth = require("../auth")(models);
        this.activityController = activityController;
        this.models = models;
    }

    async getAll(req, res, next) {
        let result = await this.activityController.getAll();
        res.send(result);
    }

    async getByID(req, res, next) {

        try {
            // const authenticated = await this.auth.authenticate(req, res, next);
            // if (authenticated) {
            // }
            const id = req.params.id;
            const activity = await this.activityController.getByID(id);
            res.status(200).send(activity);
        } catch (e) {
            return false;
        }
    }

    async create(req, res, next) {
        const { name, description, startDateUTC, endDateUTC, duration,
            isRecurring, recurrencePattern } = req.body;

        try {
            const success = await this.activityController.create({
                name, description, startDateUTC, endDateUTC, duration, isRecurring,
                recurrencePattern
            });

            if (success) {
                res.status(200).send({
                    success: true,
                    message: "Activity created"
                });
            }
        } catch (e) {
            console.log(e);
            res.status(500).send({
                success: false,
                message: "Error when creating user"
            });
        }
    }
}

module.exports = ActivityAPI;
