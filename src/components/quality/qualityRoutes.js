module.exports = (router, qualities) => {
    router.get("", (rq, rs, n) => {qualities.getAll(rq, rs, n);})

    return router;
}
