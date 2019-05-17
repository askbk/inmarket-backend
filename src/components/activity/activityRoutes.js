module.exports = (router, activities) => {
    router.get('/users/:id', (rq, rs, n) => {
        activities.getAll(rq, rs, n);
    });
    router.get('/:id', (rq, rs, n) => {
        activities.getByID(rq, rs, n);
    });
    router.post('/:id', (rq, rs, n) => {
        activities.update(rq, rs, n);
    });
    router.post('', (rq, rs, n) => {
        activities.create(rq, rs, n);
    });
    router.post('/:activityId/invitations/:userId', (rq, rs, n) => {
        activities.invite(rq, rs, n);
    });
    router.put('/:activityId/invitations/:userId', (rq, rs, n) =>  {
        activities.acceptInvitation(rq, rs, n);
    });

    return router;
};
