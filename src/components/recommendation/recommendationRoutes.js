module.exports = (router, recommendations) => {
    router.get("/:id/employees", (rq, rs, n) => {recommendations.getEmployeeRecommendations(rq, rs, n);});

    return router;
}
