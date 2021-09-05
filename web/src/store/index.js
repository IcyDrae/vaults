import { createStore, createLogger } from 'vuex';
import user from './modules/user';

const debug = process.env.NODE_ENV !== 'production';

/**
 * Main store containing all the needed modules and settings.
 */
export default createStore({
    modules: {
        user
    },
    strict: debug,
    plugins: debug ? [createLogger()] : []
});
