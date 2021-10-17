import http from "../http";
import {api} from "./index";
import store from "../../store";
import {Factory} from "../../factory";
import {Security} from "../../plugins/Security";

export default {
    ITEM_TYPE: "note",

    endpoints: {
        API: "/note",
        CREATE() {
            return this.API + "/create"
        },
        UPDATE(noteId) {
            return this.API + "/update/" + noteId
        },
        DELETE(noteId) {
            return this.API + "/delete/" + noteId
        }
    },

    store,

    security: new Security(),

    /**
     * The main method for creating a note object.
     *
     * @param values
     * @param vaultId
     * @returns {Promise<*|*|undefined>}
     */
    async create(values, vaultId) {
        let self = this;

        /**
         * Initializes the process of creating a note.
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
         * Handles the request to create a note.
         */
        const handler = async function(values, vaultId) {
            let encryptedObject = self.beforeDispatch(values);

            return await createNote(encryptedObject, vaultId);
        }

        /**
         * Makes the request to create a note.
         */
        const createNote = async function(values, vaultId) {
            let url = self.endpoints.CREATE();

            let response = await http.request({
                method: "post",
                url: url,
                data: {
                    vaultId: vaultId,
                    userId: self.store.getters["user/getUser"].id,
                    data: values
                }
            });

            return successHandler(response);
        };

        const successHandler = async function(response) {
            if(response.status === 201) {
                let decryptedNote = api.decryptResponseObject(response.data);
                let item = self.createNoteFromFactory(decryptedNote);

                await self.store.dispatch("user/addItem", item);

                return item;
            }
        };

        return await init(values, vaultId);
    },

    /**
     * The main method for updating a note object.
     *
     * @param object
     * @param id
     * @returns {Promise<*>}
     */
    async update(object, id) {
        let self = this;

        /**
         * Initializes the process of updating a note.
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
         * Handles the request to update a note.
         */
        const handler = async function(object, id) {
            let encryptedObject = self.beforeDispatch(object);

            return await updateNote(encryptedObject, id);
        };

        /**
         * Makes the request to update a note.
         */
        const updateNote = async function(object, id) {
            let url = self.endpoints.UPDATE(id);

            let response = await http.request({
                method: "put",
                url: url,
                data: {
                    userId: self.store.getters["user/getUser"].id,
                    data: object
                }
            });

            return successHandler(response);
        };

        const successHandler = async function(response) {
            if(response.status === 200) {
                let decryptedNote = api.decryptResponseObject(response.data);
                let item = self.createNoteFromFactory(decryptedNote);

                await self.store.dispatch("user/updateItem", item);

                return item;
            }
        };

        return await init(object, id);
    },

    /**
     * Main method for deleting a note object.
     *
     * @param id
     * @returns {Promise<*>}
     */
    async delete(id) {
        let self = this;

        /**
         * Initializes the process of deleting a note.
         *
         * @param id
         * @returns {Promise<*>}
         */
        const init = async function(id) {
            try {
                return await deleteNote(id);
            } catch (error) {
                return error;
            }
        };

        /**
         * Makes the request to delete a note.
         */
        const deleteNote = async function(id) {
            let url = self.endpoints.DELETE(id);

            let response = await http.request({
                method: "delete",
                url: url,
                data: JSON.stringify({
                    userId: self.store.getters["user/getUser"].id,
                })
            });

            return successHandler(response, id);
        };

        const successHandler = async function(response) {
            if(response.status === 204) {
                await self.store.dispatch("user/deleteItem", id);

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

    createNoteFromFactory(item) {
        let formatted = new Factory().create("note", item);

        return formatted.dto();
    }
}
