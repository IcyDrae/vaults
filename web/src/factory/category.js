/**
 * Category entity class.
 */
export class Category {
    id = Number;
    data = Object;
    items_amount = Number;

    constructor({ id, data, items_amount }) {
        this.id = id;
        this.data = data;
        this.items_amount = items_amount;
    }

    /**
     * Represents a category.
     *
     * @returns {{category_name: *, id: NumberConstructor, items_amount: NumberConstructor}}
     */
    dto() {
        return {
            "id": this.id,
            "category_name": this.data.category_name,
            "items_amount": this.items_amount
        };
    }
}
