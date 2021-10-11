/**
 * Vault entity class.
 */
export class Vault {
    id = Number;
    data = Object;
    logins_amount = Number;

    constructor({ id, data, logins_amount }) {
        this.id = id;
        this.data = data;
        this.logins_amount = logins_amount;
    }

    /**
     * Represents a vault.
     *
     * @returns {{logins_amount: NumberConstructor, vault_description: *, id: NumberConstructor, vault_name: *}}
     */
    dto() {
        return {
            "id": this.id,
            "vault_name": this.data.vault_name,
            "vault_description": this.data.vault_description,
            "logins_amount": this.logins_amount
        };
    }
}
