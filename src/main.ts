import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';

const app = createApp(App);
if (process.env.NODE_ENV == 'development') {
    const documentPlugins = await import('../packages');
    app.use(documentPlugins.default, router);
}
app.use(router);
app.mount('#app');
