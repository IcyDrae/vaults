/**
 * Global mixins config file. Contains useful helper functions that will be used in the components when needed.
 */
export default {
    created() {
        this.isObjectEmpty;
    },
    methods: {
        isObjectEmpty(object) {
            return !(Object.keys(object).length);
        },
    }
}
