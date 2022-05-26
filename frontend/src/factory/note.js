/**
 * Note entity class.
 */
export class Note {
    object = Object;

    constructor(object) {
        this.object = object;
    }

    /**
     * Represents a note.
     *
     * @returns {{item_type: *, name: {label: string, type: string, value}, id: *, note_description: {label: string, type: string, value: ({label: string, type: string, value}|*|string)}, vault_id: *}}
     */
    dto() {
        return {
            "id": this.object.id,
            "vault_id": this.object.vault_id,
            "category": this.object.category_id ?? "",
            "name": {
                "label": "Name",
                "value": this.object.data.note_name,
                "type": "text"
            },
            "note_description": {
                "label": "Description",
                "value": this.object.data.note_description ?? "",
                "type": "textarea"
            },
            "item_type": this.object.data.item_type
        }
    }
}
