/**
 * Note entity class.
 */
export class Note {
    id = Number;
    data = Object;
    someNoteField = String;

    constructor({ id, data, someNoteField }) {
        this.id = id;
        this.data = data;
        this.someNoteField = someNoteField;
    }

    /**
     * Represents a note.
     *
     * @returns {{data: ObjectConstructor, someNoteField: StringConstructor, id: NumberConstructor}}
     */
    dto() {
        return {
            id: this.id,
            data: this.data,
            someNoteField: this.someNoteField
        }
    }
}
