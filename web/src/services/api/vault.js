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
     * The main method to fetch all items for this vault.
     *
     * @param vaultId
     * @returns {Promise<*>}
     */
    async getItems(vaultId) {
        let self = this;

        /**
         * Initializes the process.
         *
         * @param vaultId
         * @returns {Promise<*|undefined>}
         */
        const init = async function(vaultId) {
            try {
                return await fetchItems(vaultId);
            } catch (error) {
                return error;
            }
        };

        /**
         * Requests all items for this vault.
         *
         * @param vaultId
         * @returns {Promise<*|undefined>}
         */
        const fetchItems = async function(vaultId) {
            let url = self.endpoints.ITEMS(vaultId)

            let items = await http.request({
                method: "get",
                url: url,
                data: null
            });

            return await fetchItemsSuccessHandler(items);
        };

        /**
         * Handler when 'fetchItems' resolved successfully.
         *
         * @param response
         * @returns {Promise<*>}
         */
        const fetchItemsSuccessHandler = async function(response) {
            if(response.status === 200) {
                let decryptedItems = api.decryptResponseObjects(response.data);
                let items = createItemsFromFactory(decryptedItems);

                await self.store.dispatch("user/setItems", items);

                return response;
            }
        };

        const createItemsFromFactory = function(items) {
            let formatted = [];

            items.forEach(item => {
                let type = item.data.item_type;
                let itemObject = new Factory().create(type, item);

                formatted.push(itemObject.dto());
            });

            return formatted;
        };

        return await init(vaultId);
    },

    /**
     * The main method to fetch the user's encrypted vaults.
     *
     * @returns {Promise<void>}
     */
    async fetchAll() {
        let self = this;

        /**
         * Initializes the process.
         *
         * @returns {Promise<*|*>}
         */
        const init = async function() {
            try {
                return await fetchVaults();
            } catch (error) {
                return error;
            }
        };

        /**
         * Requests the user's encrypted vaults.
         *
         * @returns {Promise<*>}
         */
        const fetchVaults = async function() {
            let vaults = await http.request({
                method: "get",
                url: self.endpoints.API,
                params: {
                    userId: self.store.getters["user/getUser"].id
                },
                data: null
            });

            return fetchVaultsSuccessHandler(vaults);
        };

        /**
         * Handler when 'fetchVaults' resolved successfully.
         *
         * @param response
         * @returns {{}}
         */
        const fetchVaultsSuccessHandler = function(response) {
            if(response.status === 200) {
                let decryptedVaults = api.decryptResponseObjects(response.data);

                return createVaultsFromFactory(decryptedVaults);
            }
        };

        const createVaultsFromFactory = function(vaults) {
            let formatted = [];

            vaults.forEach(vault => {
                let vaultObject = new Factory().create("vault", vault);

                formatted.push(vaultObject.dto());
            });

            return formatted;
        };

        return await init();
    },

    /**
     * The main method to create an encrypted vault.
     *
     * @param values
     * @returns {Promise<AxiosResponse<any>|*>}
     */
    async create(values) {
        let self = this;

        /**
         * Initializes the process.
         *
         * @param values
         * @returns {Promise<AxiosResponse<*>|*>}
         */
        const init = async function(values) {
            try {
                return await createVault(values);
            } catch (error) {
                return error;
            }
        };

        /**
         * Makes the request to create a vault.
         *
         * @param values
         * @returns {Promise<AxiosResponse<any>>}
         */
        const createVault = async function(values) {
            return await http.request({
                method: "post",
                url: self.endpoints.CREATE(),
                data: {
                    userId: self.store.getters["user/getUser"].id,
                    data: values
                }
            });
        };

        return await init(values);
    },

    /**
     * The main method to update a vault.
     *
     * @param id
     * @param values
     * @returns {Promise<AxiosResponse<any>|*>}
     */
    async update(id, values) {
        let self = this;

        /**
         * Initializes the process.
         *
         * @param id
         * @param values
         * @returns {Promise<AxiosResponse<*>|*>}
         */
        const init = async function(id, values) {
            try {
                return await updateVault(id, values);
            } catch (error) {
                return error;
            }
        };

        /**
         * Makes the request to update a vault.
         *
         * @param id
         * @param values
         * @returns {Promise<AxiosResponse<any>>}
         */
        const updateVault = async function(id, values) {
            let url = self.endpoints.UPDATE(id);

            return await http.request({
                method: "put",
                url: url,
                data: {
                    userId: self.store.getters["user/getUser"].id,
                    data: values
                }
            });
        };

        return await init(id, values);
    },

    /**
     * The main method to delete a vault.
     *
     * @param id
     * @returns {Promise<AxiosResponse<*>|*>}
     */
    async delete(id) {
        let self = this;

        /**
         * Initializes the process.
         *
         * @param id
         * @returns {Promise<AxiosResponse<*>|*>}
         */
        const init = async function(id) {
            try {
                return await deleteVault(id);
            } catch (error) {
                return error;
            }
        };

        /**
         * Makes the request to delete a vault.
         *
         * @param id
         * @returns {Promise<AxiosResponse<any>>}
         */
        const deleteVault = async function(id) {
            let url = self.endpoints.DELETE(id);

            return await http.request({
                method: "delete",
                url: url,
                data: JSON.stringify({
                    userId: self.store.getters["user/getUser"].id
                })
            });
        };

        return await init(id);
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
