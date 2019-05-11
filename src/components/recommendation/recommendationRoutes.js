module.exports = (router, recommendations) => {
    router.get("/:id/employees", (rq, rs, n) => {recommendations.getEmployeeRecommendations(rq, rs, n);});
    router.get("/:id/jobseekers", (rq, rs, n) => {recommendations.getJobseekerRecommendations(rq, rs, n);});

    return router;
}
