import * as pbkdf2 from "pbkdf2";
import * as aes from "aes-js";

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

    encrypt(data, encryptionKey) {
        let aesInstance = new aes.ModeOfOperation.cbc(encryptionKey);

        let dataInBytes = aes.utils.utf8.toBytes(data);
        let encryptedBytes = aesInstance.encrypt(aes.padding.pkcs7.pad(dataInBytes));

        return aes.utils.hex.fromBytes(encryptedBytes);
    }

    decrypt(encryptedData, encryptionKey) {
        let aesInstance = new aes.ModeOfOperation.cbc(encryptionKey);
        let dataInBytes = aes.utils.hex.toBytes(encryptedData);
        let decryptedBytes = aesInstance.decrypt(dataInBytes);

        return aes.utils.utf8.fromBytes(aes.padding.pkcs7.strip(decryptedBytes));
    }
}
