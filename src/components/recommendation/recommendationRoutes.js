module.exports = (router, recommendations) => {
    router.get("/:id/employees", (rq, rs, n) => {recommendations.getContactRecommendations(rq, rs, n);});

    return router;
}
