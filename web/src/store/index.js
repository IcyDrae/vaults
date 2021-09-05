import { createStore, createLogger } from 'vuex'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
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
    modules: {
    },
    strict: debug,
    plugins: debug ? [createLogger()] : []
})
