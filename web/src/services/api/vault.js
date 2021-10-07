import http from "../http";
import Encryption from "../../encryption-flow/Encryption";
import store from "../../store";

export default {

    endpoint: "/vaults",

    store,

    encryption: new Encryption(),

    /**
     * Handles the request to the user's encrypted vaults.
     *
     * @returns {Promise<void>}
     */
    async fetchAll() {
        try {
            return await this.fetchVaults();
        } catch (error) {
            return error;
        }
    },

    /**
     * Requests the user's encrypted vaults.
     *
     * @returns {Promise<*>}
     */
    async fetchVaults() {
        let vaults = await http.request({
            method: "get",
            url: this.endpoint,
            params: {
                userId: this.store.getters["user/getUser"].id
            },
            data: null
        });

        return this.fetchVaultsSuccessHandler(vaults);
    },

    /**
     * Handler when 'fetchVaults' resolved successfully.
     *
     * @param response
     * @returns {{}}
     */
    fetchVaultsSuccessHandler(response) {
        if(response.status === 200) {
            return this.decryptVaults(response.data);
        }
    },

    /**
     * Decrypts the given vaults & decodes them into an array.
     *
     * @param results
     * @returns {{}}
     */
    decryptVaults(results) {
        let decryptedVaults = {};

        results.forEach((result, index) => {
            let vault = result.vault;

            vault.data = this.encryption.decrypt(vault.data, this.store.getters["user/getEncryptionKey"]);
            vault.data = JSON.parse(vault.data);

            decryptedVaults[index] = this.createVaultObject(result);
        });

        return decryptedVaults;
    },

    /**
     * Makes a new vault array with the decrypted data.
     *
     * @param object
     */
    createVaultObject(object) {
        return {
            "id": object.vault.id,
            "vault_name": object.vault.data.vault_name,
            "vault_description": object.vault.data.vault_description,
            "logins_amount": object.logins_amount
        };
    }
}
