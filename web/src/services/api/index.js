import vault from "./vault";
import login from "./login";
import note from "./note";
import store from "../../store";
import {Security} from "../../plugins/Security";

let security = new Security();

export const api = {

    /**
     * Decrypts the given response into an array of objects.
     *
     * @param objects
     * @returns {[string, unknown][]}
     */
    decryptResponse(objects) {
        let decryptedObjects = {};

        objects.forEach((object, index) => {
            let item = object.data;

            item = security.decrypt(item, store.getters["user/getEncryptionKey"]);
            item = JSON.parse(item);

            object.data = item;

            decryptedObjects[index] = object;
        });

        return Object.values(decryptedObjects);
    },

    vault,
    login,
    note
}
