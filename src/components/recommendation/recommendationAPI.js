class RecommendationAPI {
    constructor(recommend, auth) {
        this.recommend = recommend;
        this.auth = auth;
    }

    async getEmployeeRecommendations(req, res, next) {
        const userContext = {
            userId: req.params.id
        };

        try {
            const employees = await this.recommend.employeeRecommendations(userContext);

            res.status(200).send({
                success: true,
                data: employees
            });
        } catch (e) {
            res.status(500).send({
                success: "false",
                message: `Error when retrieving employee recommendations: ${e}`
            });
        }
    }

    async getJobseekerRecommendations(req, res, next) {
        const userContext = {
            userId: req.params.id
        };

        try {
            const jobseekers = await this.recommend.jobseekerRecommendations(userContext);

            res.status(200).send({
                success: true,
                data: jobseekers
            });
        } catch (e) {
            res.status(500).send({
                success: "false",
                message: `Error when retrieving jobseeker recommendations: ${e}`
            });
        }
    }
}

module.exports = RecommendationAPI;
