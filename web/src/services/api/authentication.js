import http from "../http";
import {Security} from "../../plugins/Security";
import store from "../../store";
import mixins from "../../plugins/mixins";

export default {
    endpoints: {
        API: "/category",
        CREATE() {
            return this.API
        },
        UPDATE(categoryId) {
            return this.API + "/update/" + categoryId
        },
        DELETE(categoryId) {
            return this.API + "/" + categoryId
        },
        ITEMS(categoryId) {
            return this.API + "/" + categoryId + "/items"
        }
    },

    store,

    security: new Security(),

    isObjectEmpty: mixins.methods.isObjectEmpty,

    /**
     * The main registration method.
     *
     * @param values
     * @returns {Promise<AxiosResponse<any>|*|undefined>}
     */
    async register(values) {
        let self = this;

        /**
         * Initializes the process.
         *
         * @param values
         * @returns {Promise<AxiosResponse<any>|*>}
         */
        const init = async function(values) {
            try {
                return await handler(values);
            } catch(error) {
                return error;
            }
        };

        /**
         * Creates the encryption key and authentication hash, persists the key, sets the password to the new value and triggers the request.
         *
         * @param values
         * @returns {Promise<AxiosResponse<any>>}
         */
        const handler = async function(values) {
            let derived = await self.deriveFromMasterPassword(values.master_password, values.email);

            await self.store.dispatch("user/setEncryptionKey", derived.encryptionKey);

            values = resetMasterPassword(values, derived.authenticationHash);

            values = createMasterPasswordArray(values);

            return await register(values);
        };

        /**
         * Sets the password & password confirmation to the authentication hash.
         *
         * @param values
         * @param authenticationHash
         */
        const resetMasterPassword = function(values, authenticationHash) {
            values.master_password = authenticationHash.toString("hex");
            values.master_password_confirmation = authenticationHash.toString("hex")

            return values;
        };

        /**
         * Create a "master_password" array since the password field in the backend is a type of "RepeatedType",
         * in which the two fields are children of the password field. In the end deleting the remaining "master_password_confirmation".
         *
         * @param values
         */
        const createMasterPasswordArray = function(values) {
            values.master_password = {
                "password": values.master_password,
                "password_confirmation": values.master_password_confirmation
            };

            delete values.master_password_confirmation;

            return values;
        };

        /**
         * Makes the request to register an end-user.
         */
        const register = async function(values) {
            return await http.request({
                method: "post",
                url: "/register",
                data: {
                    form: values
                }
            });
        };

        return await init(values);
    },

    /**
     * The main login method.
     *
     * @param values
     * @returns {Promise<void|*|undefined>}
     */
    async login(values) {
        let self = this;

        /**
         * Initializes the process.
         *
         * @param values
         * @returns {Promise<void|*>}
         */
        const init = async function(values) {
            try {
                return await handler(values);
            } catch (error) {
                return error;
            }
        };

        /**
         * Creates the encryption key and authentication hash, persists the key, sets the password to the new value and triggers the request.
         *
         * @param values
         * @returns {Promise<void>}
         */
        const handler = async function(values) {
            let hashes = await self.deriveFromMasterPassword(values.login_master_password, values.login_email);

            await self.store.dispatch("user/setEncryptionKey", hashes.encryptionKey);

            values.login_master_password = hashes.authenticationHash.toString("hex");

            return await login(values);
        };

        /**
         * Makes the request to login an end-user.
         */
        const login = async function(values) {
            let response = await http.request({
                method: "post",
                url: "/login",
                data: {
                    form: values
                }
            });

            return successHandler(response);
        };

        const successHandler = async function(response) {
            let user = response.data.user;
            user = JSON.parse(user);

            if (self.isObjectEmpty(self.store.getters["user/getUser"])) {
                await self.store.dispatch("user/setUser", {
                    "id": user.id,
                    "firstName": user.firstName,
                    "lastName": user.lastName,
                    "email": user.email,
                    "username": user.username,
                    "roles": user.roles,
                    "registeredAt": user.registeredAt
                })
            }
        }

        return await init(values);

    },

    logout() {

    },

    /**
     * Hash the master password into an encryption key and an authentication hash.
     *
     * @param masterPassword
     * @param email
     * @returns Object
     */
    async deriveFromMasterPassword(masterPassword, email) {
        let encryptionKey = await this.security.hash(masterPassword, email, 100100);
        let authenticationHash = await this.security.hash(masterPassword, encryptionKey, 1);

        return {
            encryptionKey,
            authenticationHash
        };
    }
}
