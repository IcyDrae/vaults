import { createStore, createLogger } from 'vuex';
import user from './modules/user';
import app_state from './modules/app_state';

const debug = process.env.NODE_ENV !== 'production';

/**
 * Main store containing all the needed modules and settings.
 */
export default createStore({
    modules: {
        user,
        app_state
    },
    strict: debug,
    plugins: debug ? [createLogger()] : []
});
