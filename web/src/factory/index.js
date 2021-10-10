import {Vault} from "./vault";
import {Login} from "./login";
import {Note} from "./note";

export class Factory {
    type = String;

    types = {
        "vault": Vault,
        "login": Login,
        "note": Note
    };

    constructor(type, attributes) {
        this.type = type;

        return new this.types[type](attributes);
    }

    dto() {
        return this.types[this.type].dto();
    }
}
