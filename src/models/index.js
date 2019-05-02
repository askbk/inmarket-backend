const User          = require("./user");
const Activity      = require("./activity");
const Skill    = require("./skill");
const Conversation  = require("./conversation");

module.exports = {
    ...User,
    ...Activity,
    ...Skill,
    ...Conversation
}
