import {Vault} from "./vault";
import {Category} from "./category";
import {Login} from "./login";
import {Note} from "./note";

/**
 * Factory class for all entities, used to dynamically create objects.
 */
export class Factory {
    types = {
        "vault": Vault,
        "category": Category,
        "login": Login,
        "note": Note
    };

    /**
     * Used to dynamically create entities using a type & the needed attributes.
     *
     * @param type string
     * @param attributes object
     * @returns {*}
     */
    create(type, attributes) {
        return new this.types[type](attributes);
    }

    /**
     * Represents the entity.
     *
     * @returns {*}
     */
    dto() {}
}
