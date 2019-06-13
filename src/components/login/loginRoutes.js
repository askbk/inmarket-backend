module.exports = (router, loginAPI) => {
    router.post('', (rq, rs, n) => {
        loginAPI.login(rq, rs, n);
    });

    router.post('/update', (rq, rs, n) => {
        loginAPI.updateCredentials(rq, rs, n);
    });

    return router;
};
