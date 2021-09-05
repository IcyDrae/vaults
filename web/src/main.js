import { createApp } from 'vue';
import App from './App.vue';
import store from './store'
import router from './router';
import mixins from './plugins/mixins';

createApp(App)
    .mixin(mixins)
    .use(router)
    .use(store)
    .mount('#app')
