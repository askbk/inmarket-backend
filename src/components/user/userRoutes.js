module.exports = (router, users) => {
    router.get("", users.getAll)
    router.get("/:id", users.getByID);
    router.post("/", users.post);

    return router;
}
