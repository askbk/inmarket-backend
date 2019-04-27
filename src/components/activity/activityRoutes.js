module.exports = (router, activites) => {
    router.get("", (rq, rs, n) => {activites.getAll(rq, rs, n);})
    router.get("/:id", (rq, rs, n) => {activites.getByID(rq, rs, n);});
    router.post("", (rq, rs, n) => {activites.create(rq, rs, n);});

    return router;
}
