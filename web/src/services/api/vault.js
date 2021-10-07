import http from "../http";
import Encryption from "../../encryption-flow/Encryption";
import store from "../../store";

export default {

    endpoints: {
        api: "/vaults",
        get create() {
            return this.api + "/create";
        },
    },

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
            url: this.endpoints.api,
            params: {
                userId: this.store.getters["user/getUser"].id
            },
            data: null
        });

        return this.fetchVaultsSuccessHandler(vaults);
    },

    /**
     * Handles the request to create an encrypted vault.
     *
     * @param values
     * @returns {Promise<AxiosResponse<any>|*>}
     */
    async create(values) {
        try {
            return await this.createVault(values);
        } catch (error) {
            return error;
        }
    },

    /**
     * Makes the request to create a vault.
     *
     * @param values
     * @returns {Promise<AxiosResponse<any>>}
     */
    async createVault(values) {
        return await http.request({
            method: "post",
            url: this.endpoints.create,
            data: {
                userId: this.store.getters["user/getUser"].id,
                data: values
            }
        });
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
