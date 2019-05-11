class RecommendationAPI {
    constructor(recommend, auth) {
        this.recommend = recommend;
        this.auth = auth;

        console.log(this.recommend);
    }

    async getEmployeeRecommendations(req, res, next) {
        const userContext = {
            userId: req.params.id
        };

        try {
            const employees = await this.recommend.employeeRecommendations(userContext);

            res.status(200).send(employees);
        } catch (e) {
            res.status(500).send({
                "success": "false",
                "message": `Error when retrieving employee recommendations: ${e}`
            });
        }
    }

    async getJobseekerRecommendations(req, res, next) {
        const userContext = {
            userId: req.params.id
        };

        try {
            const jobseekers = await this.recommend.jobseekerRecommendations(userContext);

            res.status(200).send(jobseekers);
        } catch (e) {
            res.status(500).send({
                "success": "false",
                "message": `Error when retrieving jobseeker recommendations: ${e}`
            });
        }
    }
}

module.exports = RecommendationAPI;
