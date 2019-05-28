module.exports = (router, activities) => {
    // Get activities and received invitations for a user
    router.get('/users/:id', (rq, rs, n) => {
        activities.getAll(rq, rs, n);
    });

    // Get an activity
    router.get('/:id', (rq, rs, n) => {
        activities.getByID(rq, rs, n);
    });

    // Create a new activity
    router.post('', (rq, rs, n) => {
        activities.create(rq, rs, n);
    });

    // Update an existing activity
    router.put('/:id', (rq, rs, n) => {
        activities.update(rq, rs, n);
    });

    // Invite a user to an activity
    router.post('/:activityId/invitations/:userId', (rq, rs, n) => {
        activities.invite(rq, rs, n);
    });

    // Create activity and immediately invite a user
    router.post('/users/:userId', (rq, rs, n) => {
        activities.createAndInvite(rq, rs, n);
    });

    // Accept an invitation to an activity
    router.post('/:activityId/invitations/:userId/accept', (rq, rs, n) => {
        activities.acceptInvitation(rq, rs, n);
    });

    // Decline an invitation to an activity
    router.post('/:activityId/invitations/:userId/decline', (rq, rs, n) => {
        activities.declineInvitation(rq, rs, n);
    });

    return router;
};
