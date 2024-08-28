import { createApp } from 'vue'
import { createPinia } from 'pinia';
import { MotionPlugin } from '@vueuse/motion'
import './assets/index.css'
import './assets/nprogress.css'
import App from './App.vue'
import router from './router'

const app = createApp(App);
const pinia = createPinia();

app.use(MotionPlugin)
app.use(router);
app.use(pinia);
app.mount('#app')
