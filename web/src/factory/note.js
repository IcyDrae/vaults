/**
 * Note entity class.
 */
export class Note {
    id = Number;
    data = Object;

    constructor({ id, data }) {
        this.id = id;
        this.data = data;
    }

    /**
     * Represents a note.
     *
     * @returns {{item_type: *, name: {label: string, type: string, value: *}, id: NumberConstructor, note_description: {label: string, type: string, value: (*|string)}}}
     */
    dto() {
        return {
            "id": this.id,
            "name": {
                "label": "Name",
                "value": this.data.note_name,
                "type": "text"
            },
            "note_description": {
                "label": "Description",
                "value": this.data.note_description ?? "",
                "type": "textarea"
            },
            "item_type": this.data.item_type
        }
    }
}
