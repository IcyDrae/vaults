/**
 * This module is used to manage the user state, such as user profile data etc.
 */
export default {
    namespaced: true,
    state: {
        user: Object,
        encryptionKey: Uint8Array,
        authenticationHash: Uint8Array,
        logins: []
    },
    mutations: {
        setUser(state, payload) {
            state.user = payload;
        },
        setEncryptionKey(state, payload) {
            state.encryptionKey = payload;
        },
        setAuthenticationHash(state, payload) {
            state.authenticationHash = payload;
        },
        setLogins(state, payload) {
            state.logins = payload;
        },
        addLogin(state, payload) {
            state.logins.push(payload);
        }
    },
    actions: {
        setUser(context, payload) {
            context.commit("setUser", payload);
        },
        setEncryptionKey(context, payload) {
            context.commit("setEncryptionKey", payload);
        },
        setAuthenticationHash(context, payload) {
            context.commit("setAuthenticationHash", payload);
        },
        setLogins(context, payload) {
            context.commit("setLogins", payload);
        },
        addLogin(context, payload) {
            context.commit("addLogin", payload);
        }
    },
    getters: {
        getUser(state) {
            return state.user;
        },
        getEncryptionKey(state) {
            return state.encryptionKey;
        },
        getAuthenticationHash(state) {
            return state.authenticationHash;
        },
        getLogins(state) {
            return state.logins;
        }
    },
}
