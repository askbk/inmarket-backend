class TokenIssuer {
    constructor() {
        this.jwt = require('jsonwebtoken');

        this.privateKey = require('./private.js');
        this.publicKey = require('./public.js');

        const i = 'InMarket',
            a = 'app.inmarket.as',
            texp = '12h',
            alg = 'RS256';

        this.signOptions = {
            algorithm: alg,
            audience: a,
            issuer: i
        };

        this.verifyOptions = {
            algorithm: alg,
            audience: a,
            issuer: i
        };
    }

    issue(userContext) {
        return new Promise((resolve, reject) => {
            this.jwt.sign(
                {
                    sub: userContext.userId,
                    name: userContext.fullName,
                    admin: userContext.isAdmin
                },
                this.privateKey,
                this.signOptions,
                (err, token) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }

                    resolve(token);
                }
            );
        });
    }

    verify(token) {
        return new Promise((resolve, reject) => {
            this.jwt.verify(
                token,
                this.publicKey,
                this.verifyOptions,
                (err, decoded) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }

                    resolve(decoded);
                }
            );
        });
    }
}

module.exports = TokenIssuer;
