const User          = require("./user");
const Activity      = require("./activity");
const Competence    = require("./competence");
const Conversation  = require("./conversation");

module.exports = {
    ...User,
    ...Activity,
    ...Competence,
    ...Conversation
}
