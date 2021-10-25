import authentication from "./authentication";
import vault from "./vault";
import category from "./category";
import login from "./login";
import note from "./note";
import store from "../../store";
import {Security} from "../../plugins/Security";

let security = new Security();

export const api = {

    /**
     * Decrypts a single entity object from the response.
     *
     * @param object
     * @returns {{}}
     */
    decryptResponseObject(object) {
        let decryptedObject = {};

        let item = object.data;

        item = security.decrypt(item, store.getters["user/getEncryptionKey"]);
        item = JSON.parse(item);

        object.data = item;
        decryptedObject = object;

        return decryptedObject;
    },

    /**
     * Decrypts multiple entities into an array of objects.
     *
     * @param data
     * @returns {[string, unknown][]}
     */
    decryptResponseObjects(data) {
        let decryptedObjects = {};

        data.forEach((object, index) => {
            object = this.decryptResponseObject(object);

            decryptedObjects[index] = object;
        });

        return Object.values(decryptedObjects);
    },

    authentication,
    category,
    vault,
    login,
    note
}
