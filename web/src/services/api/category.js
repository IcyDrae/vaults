import http from "../http";
import {api} from "./index";
import {Factory} from "../../factory";
import {Security} from "../../plugins/Security";
import store from "../../store";

export default {
    endpoints: {
        API: "/categories",
        CREATE() {
            return this.API;
        },
        DELETE(categoryId) {
            return this.API + "/" + categoryId;
        }
    },

    store,

    security: new Security(),

    /**
     * The main method to fetch the user's encrypted categories.
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
                return await fetchCategories();
            } catch (error) {
                return error;
            }
        };

        /**
         * Requests the user's encrypted categories.
         *
         * @returns {Promise<*>}
         */
        const fetchCategories = async function() {
            let categories = await http.request({
                method: "get",
                url: self.endpoints.API,
                data: null
            });

            return await successHandler(categories);
        };

        /**
         * Handler when 'fetchCategories' resolved successfully.
         *
         * @param response
         * @returns {{}}
         */
        const successHandler = async function(response) {
            if(response.status === 200) {
                let decryptedCategories = api.decryptResponseObjects(response.data);

                let categories = createCategoriesFromFactory(decryptedCategories);

                await self.store.dispatch("user/setCategories", categories);
            }

            return response;
        };

        const createCategoriesFromFactory = function(categories) {
            let formatted = [];

            categories.forEach(category => {
                let categoryObject = {
                    id: category.id,
                    data: category.data,
                    vault_id: category.vault_id
                };

                categoryObject = new Factory().create("category", categoryObject);

                formatted.push(categoryObject.dto());
            });

            return formatted;
        };

        return await init();
    },

    /**
     * The main method to create an encrypted category.
     *
     * @param values
     * @param vaultId
     * @returns {Promise<AxiosResponse<any>|*>}
     */
    async create(values, vaultId) {
        let self = this;

        /**
         * Initializes the process.
         *
         * @param values
         * @param vaultId
         * @returns {Promise<AxiosResponse<*>|*>}
         */
        const init = async function(values, vaultId) {
            try {
                return await createCategory(values, vaultId);
            } catch (error) {
                return error;
            }
        };

        /**
         * Makes the request to create a category.
         *
         * @param values
         * @param vaultId
         * @returns {Promise<AxiosResponse<any>>}
         */
        const createCategory = async function(values, vaultId) {
            let response = await http.request({
                method: "post",
                url: self.endpoints.CREATE(),
                data: {
                    data: values,
                    vaultId: vaultId
                }
            });

            return await successHandler(response);
        };

        const successHandler = async function(response) {
            if(response.status === 201) {
                let decryptedCategory = api.decryptResponseObject(response.data);
                let categoryObject = {
                    id: decryptedCategory.id,
                    data: decryptedCategory.data,
                    vault_id: response.data.vault_id
                };

                let category = self.createCategoryFromFactory(categoryObject);

                await self.store.dispatch("user/addCategory", category);
            }

            return response;
        };

        return await init(values, vaultId);
    },

    /**
     * The main method to delete a category.
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
                return await deleteCategory(id);
            } catch (error) {
                return error;
            }
        };

        /**
         * Makes the request to delete a category.
         *
         * @param id
         * @returns {Promise<AxiosResponse<any>>}
         */
        const deleteCategory = async function(id) {
            let url = self.endpoints.DELETE(id);

            let response = await http.request({
                method: "delete",
                url: url,
                data: JSON.stringify({})
            });

            return await successHandler(response, id);
        };

        const successHandler = async function(response, id) {
            if(response.status === 204) {
                await self.store.dispatch("user/deleteCategory", id);

                let items = self.store.getters["user/getItems"].filter(item => item.category == id);

                for (const item of items) {
                    await self.store.dispatch("user/deleteItem", item.id);
                }
            }

            return response;
        };

        return await init(id);
    },

    createCategoryFromFactory(item) {
        let formatted = new Factory().create("category", item);

        return formatted.dto();
    },

    /**
     * Encrypts given vault data; used when creating and updating.
     *
     * @param data
     * @returns {string}
     */
    encryptCategory(data) {
        data = JSON.stringify(data);

        return this.security.encrypt(data, this.store.getters["user/getEncryptionKey"]);
    }
}
