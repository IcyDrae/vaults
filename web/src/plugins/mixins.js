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
        copyToClipboard(referenceName) {
            let element = this.$refs[referenceName];
            let typeAttribute = element.getAttribute("type");

            if (typeAttribute === "password") {
                element.setAttribute("type", "text");
            }

            element.select();
            document.execCommand("copy");

            if (typeAttribute === "password") {
                element.setAttribute("type", "password");
            }
        },
        isMobile() {
            return screen.width <= 992;
        }
    }
}
