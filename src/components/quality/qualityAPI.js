class QualityAPI {
    constructor(qualityController) {
        this.qualityController = qualityController;
    }

    async getAll(req, res, next) {
        try {
            const qualities = await Promise.all([
                this.qualityController.getAllSkills(),
                this.qualityController.getAllInterests()
            ]);

            res.status(200).send({
                skills: qualities[0],
                interests: qualities[1]
            });
        } catch (e) {
            return false;
        }
    }
}

module.exports = QualityAPI;
