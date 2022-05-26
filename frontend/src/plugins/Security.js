import * as pbkdf2 from "pbkdf2";
import * as aes from "aes-js";

/**
 * Used to hash the master password, make an encryption key & authentication hash out of it,
 * as well as encrypt & decrypt the vault data with the formerly created key.
 */
export class Security {

    /**
     * Asynchronously hashes the given data using PBKDF2 as a method.
     *
     * @param password The password to be hashed.
     * @param salt A unique salt for each user, this will be the E-Mail.
     * @param iterations How many times the hash takes places.
     * @returns {Promise<unknown>}
     */
    hash(password, salt, iterations) {
        return new Promise((resolve, reject) => {
            pbkdf2.pbkdf2(password, salt, iterations, 32, "sha256", (error, encryptionKey) => {
                if (error) {
                    return reject(error);
                }

                resolve(encryptionKey);
            });
        })
    }

    /**
     * Given an encryption key, encrypts the payload using AES-256 in CBC mode.
     *
     * @param data payload
     * @param encryptionKey needs to be 128 bits (16 bytes), 192 bits (24 bytes) or 256 bits (32 bytes) long.
     * @returns {string}
     */
    encrypt(data, encryptionKey) {
        let aesInstance = new aes.ModeOfOperation.cbc(encryptionKey);

        let dataInBytes = aes.utils.utf8.toBytes(data);
        let encryptedBytes = aesInstance.encrypt(aes.padding.pkcs7.pad(dataInBytes));

        return aes.utils.hex.fromBytes(encryptedBytes);
    }

    /**
     * Given encrypted data, decrypts it and converts it back to a readable UTF-8 string.
     *
     * @param data
     * @param encryptionKey
     * @returns {string}
     */
    decrypt(data, encryptionKey) {
        let aesInstance = new aes.ModeOfOperation.cbc(encryptionKey);
        let dataInBytes = aes.utils.hex.toBytes(data);
        let decryptedBytes = aesInstance.decrypt(dataInBytes);

        return aes.utils.utf8.fromBytes(aes.padding.pkcs7.strip(decryptedBytes));
    }
}
