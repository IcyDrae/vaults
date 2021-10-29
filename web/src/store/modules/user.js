/**
 * This module is used to manage the user state, such as user profile data etc.
 */
export default {
    namespaced: true,
    state: {
        user: Object,
        encryptionKey: Uint8Array,
        vaults: [],
        categories: [],
        items: [],
        generatedPassword: String
    },
    mutations: {
        setUser(state, payload) {
            state.user = payload;
        },
        setEncryptionKey(state, payload) {
            state.encryptionKey = payload;
        },
        setVaults(state, payload) {
            state.vaults = payload;
        },
        addVault(state, payload) {
            state.vaults.push(payload);
        },
        updateVault(state, payload) {
            let foundIndex = state.vaults.findIndex(element => element.id === payload.id);

            state.vaults.splice(foundIndex, 1, payload);
        },
        deleteVault(state, payload) {
            let foundIndex = state.vaults.findIndex(element => element.id === payload);

            state.vaults.splice(foundIndex, 1);
        },
        setCategories(state, payload) {
            state.categories = payload;
        },
        addCategory(state, payload) {
            state.categories.push(payload);
        },
        updateCategory(state, payload) {
            let foundIndex = state.categories.findIndex(element => element.id === payload.id);

            state.categories.splice(foundIndex, 1, payload);
        },
        deleteCategory(state, payload) {
            let foundIndex = state.categories.findIndex(element => element.id === payload);

            state.categories.splice(foundIndex, 1);
        },
        setActiveCategory(state, payload) {
            let category = state.categories.find(category => category.id === payload);

            let activeCategory = state.categories.find(category => category.active === true);
            if (activeCategory) {
                activeCategory.active = false;
            }

            category.active = true;
        },
        removeActiveCategory(state) {
            let activeCategory = state.categories.find(category => category.active === true);

            if (activeCategory) {
                activeCategory.active = false;
            }
        },
        setItems(state, payload) {
            state.items = payload;
        },
        addItem(state, payload) {
            state.items.push(payload);
        },
        updateItem(state, payload) {
            let foundIndex = state.items.findIndex(element => element.id === payload.id);

            state.items.splice(foundIndex, 1, payload);
        },
        deleteItem(state, payload) {
            let foundIndex = state.items.findIndex(element => element.id === payload);

            state.items.splice(foundIndex, 1);
        },
        setGeneratedPassword(state, payload) {
            state.generatedPassword = payload;
        }
    },
    actions: {
        setUser(context, payload) {
            context.commit("setUser", payload);
        },
        setEncryptionKey(context, payload) {
            context.commit("setEncryptionKey", payload);
        },
        setVaults(context, payload) {
            context.commit("setVaults", payload);
        },
        addVault(context, payload) {
            context.commit("addVault", payload);
        },
        updateVault(context, payload) {
            context.commit("updateVault", payload);
        },
        deleteVault(context, payload) {
            context.commit("deleteVault", payload);
        },
        setCategories(context, payload) {
            context.commit("setCategories", payload);
        },
        addCategory(context, payload) {
            context.commit("addCategory", payload);
        },
        updateCategory(context, payload) {
            context.commit("updateCategory", payload);
        },
        deleteCategory(context, payload) {
            context.commit("deleteCategory", payload);
        },
        setActiveCategory(context, payload) {
            context.commit("setActiveCategory", payload);
        },
        removeActiveCategory(context) {
            context.commit("removeActiveCategory");
        },
        setItems(context, payload) {
            context.commit("setItems", payload);
        },
        addItem(context, payload) {
            context.commit("addItem", payload);
        },
        updateItem(context, payload) {
            context.commit("updateItem", payload);
        },
        deleteItem(context, payload) {
            context.commit("deleteItem", payload);
        },
        setGeneratedPassword(context, payload) {
            context.commit("setGeneratedPassword", payload);
        }
    },
    getters: {
        getUser(state) {
            return state.user;
        },
        getEncryptionKey(state) {
            return state.encryptionKey;
        },
        getVaults(state) {
            return state.vaults;
        },
        getItems(state) {
            return state.items;
        },
        getCategories(state) {
            return state.categories;
        },
        getGeneratedPassword(state) {
            return state.generatedPassword;
        }
    }
}
