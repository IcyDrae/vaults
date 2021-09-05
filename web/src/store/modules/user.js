/**
 * This module is used to manage the user state, such as user profile data etc.
 */
export default {
    namespaced: true,
    state: {
        someGlobalStateProperty: String
    },
    mutations: {
        setSomeGlobalStateProperty(state, someGlobalStateProperty) {
            state.someGlobalStateProperty = someGlobalStateProperty;
        },
    },
    actions: {
        setSomeGlobalStateProperty(context, someGlobalStateProperty) {
            context.commit("setSomeGlobalStateProperty", someGlobalStateProperty)
        },
    },
    getters: {
        getSomeGlobalStateProperty: (state) => {
            return state.someGlobalStateProperty;
        }
    },
}
