import http from "../http";
import {api} from "./index";
import {Factory} from "../../factory";
import {Security} from "../../plugins/Security";
import store from "../../store";

export default {
    endpoints: {
        API: "/vaults",
        CREATE() {
            return this.API + "/create"
        },
        UPDATE(vaultId) {
            return this.API + "/update/" + vaultId
        },
        DELETE(vaultId) {
            return this.API + "/delete/" + vaultId
        },
        ITEMS(vaultId) {
            return this.API + "/" + vaultId + "/" + store.getters["user/getUser"].id
        }
    },

    store,

    security: new Security(),

    /**
     * Handles the request to all items for this vault.
     *
     * @param vaultId
     * @returns {Promise<*>}
     */
    async getItems(vaultId) {
        try {
            return await this.fetchItems(vaultId);
        } catch (error) {
            return error;
        }
    },

    /**
     * Requests all items for this vault.
     *
     * @param vaultId
     * @returns {Promise<*|undefined>}
     */
    async fetchItems(vaultId) {
        let url = this.endpoints.ITEMS(vaultId)

        let items = await http.request({
            method: "get",
            url: url,
            data: null
        });

        return await this.fetchItemsSuccessHandler(items);
    },

    /**
     * Handler when 'fetchItems' resolved successfully.
     *
     * @param response
     * @returns {Promise<*>}
     */
    async fetchItemsSuccessHandler(response) {
        if(response.status === 200) {
            let decryptedItems = api.decryptResponseObjects(response.data);
            let items = this.createItemsFromFactory(decryptedItems);

            await this.store.dispatch("user/setItems", items);

            return response;
        }
    },

    createItemsFromFactory(items) {
        let formatted = [];

        items.forEach(item => {
            let type = item.data.item_type;
            let itemObject = new Factory().create(type, item);

            formatted.push(itemObject.dto());
        });

        return formatted;
    },

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
            url: this.endpoints.API,
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
            let decryptedVaults = api.decryptResponseObjects(response.data);

            return this.createVaultsFromFactory(decryptedVaults);
        }
    },

    createVaultsFromFactory(vaults) {
        let formatted = [];

        vaults.forEach(vault => {
            let vaultObject = new Factory().create("vault", vault);

            formatted.push(vaultObject.dto());
        });

        return formatted;
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
            url: this.endpoints.CREATE(),
            data: {
                userId: this.store.getters["user/getUser"].id,
                data: values
            }
        });
    },

    /**
     * Handles the request to update a vault.
     *
     * @param id
     * @param values
     * @returns {Promise<AxiosResponse<any>|*>}
     */
    async update(id, values) {
        try {
            return await this.updateVault(id, values);
        } catch (error) {
            return error;
        }
    },

    /**
     * Makes the request to update a vault.
     *
     * @param id
     * @param values
     * @returns {Promise<AxiosResponse<any>>}
     */
    async updateVault(id, values) {
        let url = this.endpoints.UPDATE(id);

        return await http.request({
            method: "put",
            url: url,
            data: {
                userId: this.store.getters["user/getUser"].id,
                data: values
            }
        });
    },

    /**
     * Handles the request to delete a vault.
     *
     * @param id
     * @param values
     * @returns {Promise<AxiosResponse<*>|*>}
     */
    async delete(id) {
        try {
            return await this.deleteVault(id);
        } catch (error) {
            return error;
        }
    },

    /**
     * Makes the request to delete a vault.
     *
     * @param id
     * @returns {Promise<AxiosResponse<any>>}
     */
    async deleteVault(id) {
        let url = this.endpoints.DELETE(id);

        return await http.request({
            method: "delete",
            url: url,
            data: JSON.stringify({
                userId: this.store.getters["user/getUser"].id
            })
        });
    },

    /**
     * Encrypts given vault data; used when creating and updating.
     *
     * @param data
     * @returns {string}
     */
    encryptVault(data) {
        data = JSON.stringify(data);

        return this.security.encrypt(data, this.store.getters["user/getEncryptionKey"]);
    }
}
