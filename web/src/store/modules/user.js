/**
 * This module is used to manage the user state, such as user profile data etc.
 */
export default {
    namespaced: true,
    state: {
        user: Object
    },
    mutations: {
        setUser(state, payload) {
            state.user = payload;
        }
    },
    actions: {
        setUser(context, payload) {
            context.commit("setUser", payload)
        }
    },
    getters: {
        getUser(state) {
            return state.user;
        }
    },
}
