import http from "../http";
import {api} from "./index";
import store from "../../store";
import {Factory} from "../../factory";
import {Security} from "../../plugins/Security";

export default {
    ITEM_TYPE: "login",

    endpoints: {
        API: "/logins",
        CREATE() {
            return this.API;
        },
        UPDATE(loginId) {
            return this.API + "/" + loginId;
        },
        DELETE(loginId) {
            return this.API + "/" + loginId;
        }
    },

    store,

    security: new Security(),

    /**
     * The main method for creating a login object.
     *
     * @param values
     * @param vaultId
     * @returns {Promise<*|*|undefined>}
     */
    async create(values, vaultId) {
        let self = this;

        /**
         * Initializes the process of creating a login.
         *
         * @param values
         * @param vaultId
         * @returns {Promise<void|*>}
         */
        const init = async function(values, vaultId) {
            try {
                return await handler(values, vaultId);
            } catch (error) {
                return error;
            }
        };

        /**
         * Handles the request to create a login.
         */
        const handler = async function(object, vaultId) {
            let encryptedData = self.beforeDispatch(object);
            let categoryId = object.category ?? "";

            object = {
                encryptedData,
                categoryId
            }

            return await createLogin(object, vaultId);
        }

        /**
         * Makes the request to create a login.
         */
        const createLogin = async function(object, vaultId) {
            let url = self.endpoints.CREATE();

            let response = await http.request({
                method: "post",
                url: url,
                data: {
                    data: object.encryptedData,
                    vaultId: vaultId,
                    categoryId: object.categoryId
                }
            });

            return successHandler(response);
        };

        const successHandler = async function(response) {
            if(response.status === 201) {
                let decryptedLogin = api.decryptResponseObject(response.data);
                let item = self.createLoginFromFactory(decryptedLogin);

                await self.store.dispatch("user/addItem", item);

                return item;
            }
        };

        return await init(values, vaultId);
    },

    /**
     * The main method for updating a login object.
     *
     * @param object
     * @param id
     * @returns {Promise<*>}
     */
    async update(object, id) {
        let self = this;

        /**
         * Initializes the process of updating a login.
         *
         * @param object
         * @param id
         * @returns {Promise<*>}
         */
        const init = async function(object, id) {
            try {
                return await handler(object, id);
            } catch (error) {
                return error;
            }
        };

        /**
         * Handles the request to update a login.
         */
        const handler = async function(object, id) {
            let encryptedData = self.beforeDispatch(object);
            let categoryId = object.category ?? "";

            object = {
                encryptedData,
                categoryId
            }

            return await updateLogin(object, id);
        };

        /**
         * Makes the request to update a login.
         */
        const updateLogin = async function(object, id) {
            let url = self.endpoints.UPDATE(id);

            let response = await http.request({
                method: "put",
                url: url,
                data: {
                    data: object.encryptedData,
                    categoryId: object.categoryId
                }
            });

            return successHandler(response);
        };

        const successHandler = async function(response) {
            if(response.status === 200) {
                let decryptedLogin = api.decryptResponseObject(response.data);
                let item = self.createLoginFromFactory(decryptedLogin);

                await self.store.dispatch("user/updateItem", item);

                return item;
            }
        };

        return await init(object, id);
    },

    /**
     * Main method for deleting a login object.
     *
     * @param id
     * @returns {Promise<*>}
     */
    async delete(id) {
        let self = this;

        /**
         * Initializes the process of deleting a login.
         *
         * @param id
         * @returns {Promise<*>}
         */
        const init = async function(id) {
            try {
                return await deleteLogin(id);
            } catch (error) {
                return error;
            }
        };

        /**
         * Makes the request to delete a login.
         */
        const deleteLogin = async function(id) {
            let url = self.endpoints.DELETE(id);

            let response = await http.request({
                method: "delete",
                url: url,
                data: JSON.stringify({})
            });

            return successHandler(response, id);
        };

        const successHandler = async function(response, id) {
            if(response.status === 204) {
                await self.store.dispatch("user/deleteItem", id);

                await self.store.dispatch("user/setGeneratedPassword", "");

                return response;
            }
        };

        return await init(id);
    },

    /**
     * First steps such as setting the item type, converting to JSON & encrypting the object.
     */
    beforeDispatch(object) {
        object.item_type = this.ITEM_TYPE;
        object = JSON.stringify(object);

        return this.security.encrypt(object, this.store.getters["user/getEncryptionKey"]);
    },

    createLoginFromFactory(item) {
        let formatted = new Factory().create("login", item);

        return formatted.dto();
    }
}
