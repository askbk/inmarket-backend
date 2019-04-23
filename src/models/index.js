const User = require("./user");
const Activity = require("./activity");
const Competence = require("./competence");

module.exports = {
    ...User,
    ...Activity,
    ...Competence
}
