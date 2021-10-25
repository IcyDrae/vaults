import http from "../http";
import {Security} from "../../plugins/Security";
import store from "../../store";

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

    async register(values) {
        let self = this;

        const init = async function(values) {
            try {
                return await handler(values);
            } catch(error) {
                return error;
            }
        };

        const handler = async function(values) {
            let derived = await deriveFromMasterPassword(values);

            await self.store.dispatch("user/setEncryptionKey", derived.encryptionKey);

            values = resetMasterPassword(values, derived.authenticationHash);

            values = createMasterPasswordArray(values);

            return await register(values);
        };

        /**
         * Hash the master password into an encryption key and an authentication hash.
         *
         * @param values
         * @returns Object
         */
        const deriveFromMasterPassword = async function(values) {
            let encryptionKey = await self.security.hash(values.master_password, values.email, 100100);
            let authenticationHash = await self.security.hash(values.master_password, encryptionKey, 1);

            return {
                encryptionKey,
                authenticationHash
            };
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
         * Makes the request to update a login.
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

    login() {

    },

    logout() {

    }

}
