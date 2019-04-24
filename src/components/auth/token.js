class TokenIssuer {
    constructor() {
        this.jwt = require("jsonwebtoken");

        this.privateKey = "private key";
        this.publicKey = "public key";

        const i = "InMarket",
            a = "app.inmarket.as",
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

    issue(userId) {
        const signOptions = this.signOptions;

        signOptions.subject = userId;

        return this.jwt.sign({
            data: "hello"   // payload
        }, this.privateKey, signOptions, (err, token) => {
            if (err) {
                return false;
            }

            return token;
        });
    }

    verify(token, cb) {
        this.jwt.verify(token, this.publicKey, this.verifyOptions, cb);
    }
}

module.exports = TokenIssuer;
