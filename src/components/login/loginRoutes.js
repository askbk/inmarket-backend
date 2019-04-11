module.exports = (router, loginAPI) => {
    router.post("", loginAPI.login);

    return router;
}
