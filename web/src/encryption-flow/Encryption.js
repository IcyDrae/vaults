import * as pbkdf2 from "pbkdf2";

export default class Encryption {

    constructor(masterPassword) {
        this.masterPassword = masterPassword;
    }

    hash(salt, iterations) {
        return new Promise((resolve, reject) => {
            pbkdf2.pbkdf2(this.masterPassword, salt, iterations, 32, "sha256", (error, encryptionKey) => {
                if (error) {
                    return reject(error);
                }

                resolve(encryptionKey);
            });
        })
    }
}
