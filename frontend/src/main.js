import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import VueSocketIO from 'vue-3-socket.io'

import 'agnostic-vue/dist/common.min.css'
import "agnostic-vue/dist/index.css";


const app = createApp(App)

app.use(new VueSocketIO({
    debug: true,
    connection: 'http://localhost:4000',
   // options: { path: "/my-app/" } //Optional options
}))

app.provide('apiEndpoint', 'http://localhost:3000/api');
//app.provide('');

app.use(createPinia())
app.use(router)

app.mount('#app')
