module.exports = (router, users) => {
    router.get("", (rq, rs, n) => {users.getAll(rq, rs, n);})
    router.get("/:id", (rq, rs, n) => {users.getByID(rq, rs, n);});
    router.put("/:id", (rq, rs, n) => {users.updateProfile(rq, rs, n);});
    router.post("/:id/contact", (rq, rs, n) => {users.contact(rq, rs, n)});
    router.post("", (rq, rs, n) => {users.create(rq, rs, n);});
    router.get("/:id/recommendations/contacts", (rq, rs, n) => {users.getContactRecommendations(rq, rs, n);});

    return router;
}
