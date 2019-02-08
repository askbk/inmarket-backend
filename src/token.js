module.exports = class Token {
    constructor() {
        const fs = require("fs");
        this.jwt = require("jsonwebtoken");

        this.privateKey = fs.readFileSync(__dirname + "/private.key", "utf8"),
        this.publicKey = fs.readFileSync(__dirname + "/public.key", "utf8");

        const i = "InMarket",
            a = "app.imnor.no",
            texp = "12h",
            alg = "RS256";

        this.signOptions = {
            issuer: i,
            audience: a,
            expiresIn: texp,
            algorithm: alg
        };

        this.verifyOptions = {
            issuer: i,
            audience: a,
            expiresIn: texp,
            algorithm: [alg]
        };
    }

    issue(user) {
        const signOptions = this.signOptions;

        signOptions.subject = user;

        return this.jwt.sign({
            data: "hello"   // payload
        }, this.privateKey, signOptions);
    }

    verify(token, cb) {
        this.jwt.verify(token, this.publicKey, this.verifyOptions, cb);
    }
}
