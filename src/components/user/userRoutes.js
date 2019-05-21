module.exports = (router, users) => {
    // Get specific user
    router.get('/:id', (rq, rs, n) => {
        users.getByID(rq, rs, n);
    });

    // Update user profile
    router.put('/:id', (rq, rs, n) => {
        users.updateProfile(rq, rs, n);
    });

    // Send a contact request to the user
    router.post('/:id/contact', (rq, rs, n) => {
        users.contact(rq, rs, n);
    });

    // Decline a contact request from the user
    router.post('/:id/contact/decline', (rq, rs, n) => {
        users.declineRequest(rq, rs, n);
    });

    // Send a contact request to the user
    router.post('/:id/contact', (rq, rs, n) => {
        users.contact(rq, rs, n);
    });

    // Get contact requests (both sent and received)
    router.get('/:id/contacts/requests', (rq, rs, n) => {
        users.getContactRequests(rq, rs, n);
    });

    // Get contacts
    router.get('/:id/contacts', (rq, rs, n) => {
        users.getContact(rq, rs, n);
    });

    // Create a new user
    router.post('', (rq, rs, n) => {
        users.create(rq, rs, n);
    });

    // Insert test data into database
    router.post('/testdata', (rq, rs, n) => {
        users.insertTestData(rq, rs, n);
    });

    return router;
};
