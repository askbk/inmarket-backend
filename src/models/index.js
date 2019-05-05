const User          = require("./user");
const Activity      = require("./activity");
const Skill         = require("./skill");
const Interest      = require("./interest");
const Conversation  = require("./conversation");

module.exports = {
    ...User,
    ...Activity,
    ...Skill,
    ...Interest,
    ...Conversation
}
