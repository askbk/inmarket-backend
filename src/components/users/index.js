const router = require("express").Router();
const UsersAPI = require("./usersAPI.js")
const users = new UsersAPI();


router.get("", users.getAll)

// /api/users/:id
router.get("/:id", users.getByID);


router.post("/", users.post);

module.exports = router;
