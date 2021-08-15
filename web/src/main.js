import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import VeeValidate from 'vee-validate';

createApp(App).use(router, VeeValidate).mount('#app')
