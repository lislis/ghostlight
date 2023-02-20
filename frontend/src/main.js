import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

//import socket from 'vue3-websocket';

import 'agnostic-vue/dist/common.min.css';
import "agnostic-vue/dist/index.css";
import { generateRandomString } from '@/utils';

const app = createApp(App);

app.provide('apiEndpoint', 'http://localhost:3000/api');
const socketAddress = "ws://127.0.0.1:3000";

app.provide('socketServer', socketAddress);
//app.provide('deviceID', generateRandomString(4));

const socket = new WebSocket(socketAddress);
app.provide('socket', socket);

app.use(createPinia());
app.use(router);

//app.use(socket, 'ws://localhost:3000/ws')

app.mount('#app')
