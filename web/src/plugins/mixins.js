/**
 * Global mixins config file. Contains useful helper functions that will be used in the components when needed.
 */
export default {
    created() {
        this.isObjectEmpty;
    },
    methods: {
        /**
         * Checks if a given Object is empty.
         *
         * @param object
         * @returns {boolean}
         */
        isObjectEmpty(object) {
            return !(Object.keys(object).length);
        },
    }
}
