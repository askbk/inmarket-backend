class RecommendationAPI {
    constructor(recommend, auth) {
        this.recommend = recommend;
        this.auth = auth;

        console.log(this.recommend);
    }

    async getContactRecommendations(req, res, next) {
        const userContext = {
            userType: "jobseeker",
            userId: req.params.id
        };

        const skills = await this.recommend.employeeRecommendations(userContext);

        res.send(skills);
    }
}

module.exports = RecommendationAPI;
