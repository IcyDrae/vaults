/**
 * Vault entity class.
 */
export class Vault {
    id = Number;
    data = Object;
    items_amount = Number;

    constructor({ id, data, items_amount }) {
        this.id = id;
        this.data = data;
        this.items_amount = items_amount;
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
            "items_amount": this.items_amount
        };
    }
}
