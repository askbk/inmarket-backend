module.exports = (router, users) => {
    router.get("", (rq, rs, n) => {users.getAll(rq, rs, n);})
    router.get("/:id", (rq, rs, n) => {users.getByID(rq, rs, n);});
    router.post("", (rq, rs, n) => {users.post(rq, rs, n);});

    return router;
}
