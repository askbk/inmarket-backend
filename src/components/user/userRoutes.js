module.exports = (router, users) => {
    router.get('/:id', (rq, rs, n) => {
        users.getByID(rq, rs, n);
    });

    router.put('/:id', (rq, rs, n) => {
        users.updateProfile(rq, rs, n);
    });

    router.post('/:id/contact', (rq, rs, n) => {
        users.contact(rq, rs, n);
    });

    router.post('', (rq, rs, n) => {
        users.create(rq, rs, n);
    });

    router.post('/testdata', (rq, rs, n) => {
        users.insertTestData(rq, rs, n);
    });

    return router;
};
