class TokenIssuer {
    constructor() {
        this.jwt = require("jsonwebtoken");

        this.privateKey =   `-----BEGIN RSA PRIVATE KEY-----
                            MIIBOAIBAAJATKxUZbovMpSP4dvtZY/NCZCKj5cqmWv1uItdQ9Jo4ZU8dkCIMbKC
                            MRBVlpDgsr+cUPxq9qPXdk+h3W0Lvy9oiQIDAQABAkBMhksN5Q+qSgB5CkocbbPU
                            8gB5ZATOb6Ql9mK1iFHJo1ONNn13NEiL5DWTPf2T8jOZ+6ItDVPNEHtKdBiGWtgB
                            AiEAkN5JWJtJVf6gMLKPayUS0Dm7JMScYIceIL0lVaD9zYECIQCHfagyB+tKfSwr
                            +AnA0MgL9IDvXpvnJAc59lGsCsivCQIgc3ibIgN06xSwfuB1LMQ6QLsjjmUg+Ff7
                            DcF2VtCiPQECIBQ5Jz/Aetg1csBlV19WSmWuawhPgMmxUPrPz0T0nxuxAiBTByzn
                            aYbkAPlVM0RSD7KN5wo1EVXxM5XJlgK0iEo4ew==
                            -----END RSA PRIVATE KEY-----`;
        this.publicKey =    `-----BEGIN PUBLIC KEY-----
                            MFswDQYJKoZIhvcNAQEBBQADSgAwRwJATKxUZbovMpSP4dvtZY/NCZCKj5cqmWv1
                            uItdQ9Jo4ZU8dkCIMbKCMRBVlpDgsr+cUPxq9qPXdk+h3W0Lvy9oiQIDAQAB
                            -----END PUBLIC KEY-----`;

        const i = "InMarket",
            a = "app.inmarket.as",
            texp = "12h",
            alg = "RS256";

        //  doesn't work if signOptions is nonempty...
        this.signOptions = {
            // "typ": "JWT"
        };

        this.verifyOptions = {
            // issuer: i,
            // audience: a,
            // expiresIn: texp,
            // algorithm: [alg]
        };
    }

    issue(userId) {
        return new Promise((resolve, reject) => {
            this.jwt.sign(
                {
                  "sub": userId,
                  "name": "John Doe",
                  "admin": true
                },
                this.privateKey,
                this.signOptions,
                (err, token) => {
                    if (err) {
                        console.log(err);
                        reject(err)
                    }

                    resolve(token);
                }
            );
        });
    }

    verify(token) {
        return new Promise((resolve, reject) => {
            this.jwt.verify(token, this.publicKey, this.verifyOptions, (err, decoded) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }

                resolve(decoded);
            });
        });
    }
}

module.exports = TokenIssuer;
