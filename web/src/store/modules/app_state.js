import mixins from "../../plugins/mixins";

/**
 * This module is used to manage the app state, such as burger menu state, item active state etc.
 */
export default {
    namespaced: true,
    state: {
        itemView: Boolean
    },
    mutations: {
        setItemView(state, payload) {
            state.itemView = payload;
        }
    },
    actions: {
        setItemView(context, payload) {
            context.commit("setItemView", payload);
        },
        triggerBurgerMenu() {
            let folders = document.querySelector(".folders");

            if (mixins.methods.isMobile()) {
                if (folders.style.display === "block") {
                    folders.style.display = "none";
                } else {
                    folders.style.display = "block";
                }
            }
        }
    },
    getters: {
        getItemView(state) {
            return state.itemView;
        }
    }
}
