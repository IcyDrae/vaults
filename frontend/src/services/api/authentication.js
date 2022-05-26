import http from "../http";
import {Security} from "../../plugins/Security";
import router from "../../router";
import store from "../../store";
import mixins from "../../plugins/mixins";

export default {
    endpoints: {
        API: "/authentication",
        REGISTER() {
            return this.API + "/register"
        },
        LOGIN() {
            return this.API + "/login"
        },
        LOGOUT() {
            return this.API + "/logout"
        }
    },

    store,

    router,

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
            let url = self.endpoints.REGISTER();

            return await http.request({
                method: "post",
                url: url,
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
            let url = self.endpoints.LOGIN();

            let response = await http.request({
                method: "post",
                url: url,
                data: {
                    form: values
                }
            });

            return await successHandler(response);
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

    /**
     * The main logout method.
     *
     * @returns {Promise<void|*|undefined>}
     */
    async logout() {
        let self = this;

        /**
         * Initializes the process.
         *
         * @returns {Promise<void|*>}
         */
        const init = async function() {
            try {
                return await logout();
            } catch (error) {
                return error;
            }
        };

        /**
         * Makes the request to logout an end-user.
         *
         * @returns {Promise<void>}
         */
        const logout = async function() {
            let url = self.endpoints.LOGOUT();

            let response = await http.request({
                method: "get",
                url: url
            });

            return await successHandler(response);
        };

        /**
         * Deletes the user data from the store.
         *
         * @param response
         * @returns {Promise<void>}
         */
        const successHandler = async function(response) {
            if (response.status === 204) {
                await self.router.push("/login");
                await eraseLocalData();
            }
        };

        const eraseLocalData = async function() {
            await self.store.dispatch("user/setEncryptionKey", {});

            await self.store.dispatch("user/setGeneratedPassword", "");

            if (!self.isObjectEmpty(self.store.getters["user/getUser"])) {
                await self.store.dispatch("user/setUser", {});
            }

            if (!self.isObjectEmpty(self.store.getters["user/getVaults"])) {
                await self.store.dispatch("user/setVaults", []);
            }

            if (!self.isObjectEmpty(self.store.getters["user/getItems"])) {
                await self.store.dispatch("user/setItems", []);
            }

            if (!self.isObjectEmpty(self.store.getters["user/getCategories"])) {
                await self.store.dispatch("user/setCategories", []);
            }
        };

        return await init();
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
