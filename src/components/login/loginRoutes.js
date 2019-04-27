module.exports = (router, loginAPI) => {
    router.post("", (rq, rs, n) => {loginAPI.login(rq, rs, n);});

    return router;
}
