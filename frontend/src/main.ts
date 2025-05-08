console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/main.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app'); 