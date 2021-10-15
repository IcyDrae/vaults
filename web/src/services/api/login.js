import http from "../http";
import {api} from "./index";
import store from "../../store";
import {Factory} from "../../factory";
import {Security} from "../../plugins/Security";

export default {
    init: async function() {},
    handler: async function() {},
    successHandler: async function() {},

    ITEM_TYPE: "login",

    endpoints: {
        API: "/logins",
        CREATE() {
            return this.API + "/create"
        },
        UPDATE(loginId) {
            return this.API + "/update/" + loginId
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
     * The main method for creating a login object.
     *
     * @param values
     * @param vaultId
     * @returns {Promise<*|*|undefined>}
     */
    async create(values, vaultId) {
        /**
         * Initializes the process of creating a login.
         *
         * @param values
         * @param vaultId
         * @returns {Promise<void|*>}
         */
        this.init = async function(values, vaultId) {
            try {
                return await this.handler(values, vaultId);
            } catch (error) {
                return error;
            }
        };

        /**
         * Handles the request to create a login.
         */
        this.handler = async function(values, vaultId) {
            let encryptedObject = this.beforeDispatch(values);

            return await this.createLogin(encryptedObject, vaultId);
        };

        /**
         * Makes the request to create a login.
         */
        this.createLogin = async function(values, vaultId) {
            let url = this.endpoints.CREATE();

            let response = await http.request({
                method: "post",
                url: url,
                data: {
                    vaultId: vaultId,
                    userId: this.store.getters["user/getUser"].id,
                    data: values
                }
            });

            return this.successHandler(response);
        };

        this.successHandler = async function(response) {
            if(response.status === 201) {
                let decryptedLogin = api.decryptResponseObject(response.data);
                let item = this.createLoginFromFactory(decryptedLogin);

                await this.store.dispatch("user/addItem", item);

                return item;
            }
        };

        return await this.init(values, vaultId);
    },

    /**
     * The main method for updating a login object.
     *
     * @param object
     * @param id
     * @returns {Promise<*>}
     */
    async update(object, id) {
        /**
         * Initializes the process of updating a login.
         *
         * @param object
         * @param id
         * @returns {Promise<*>}
         */
        this.init = async function(object, id) {
            try {
                return await this.handler(object, id);
            } catch (error) {
                return error;
            }
        };

        /**
         * Handles the request to update a login.
         */
        this.handler = async function(object, id) {
            let encryptedObject = this.beforeDispatch(object);

            return await this.updateLogin(encryptedObject, id);
        };

        /**
         * Makes the request to update a login.
         */
        this.updateLogin = async function(object, id) {
            let url = this.endpoints.UPDATE(id);

            let response = await http.request({
                method: "put",
                url: url,
                data: {
                    userId: this.store.getters["user/getUser"].id,
                    data: object
                }
            });

            return this.successHandler(response);
        };

        this.successHandler = async function(response) {
            if(response.status === 200) {
                let decryptedLogin = api.decryptResponseObject(response.data);
                let item = this.createLoginFromFactory(decryptedLogin);

                await this.store.dispatch("user/updateItem", item);

                return item;
            }
        };

        return await this.init(object, id);
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
