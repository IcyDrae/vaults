/**
 * Category entity class.
 */
export class Category {
    object = Object;

    constructor(object) {
        this.object = object;
    }

    /**
     * Represents a category.
     *
     * @returns {{category_name: *, id: NumberConstructor, items_amount: NumberConstructor}}
     */
    dto() {
        return {
            "id": this.object.id,
            "category_name": this.object.data.category_name,
            "vault_id": this.object.vault_id,
            "active": false
        };
    }
}
